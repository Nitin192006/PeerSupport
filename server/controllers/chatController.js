const Chat = require('../models/Chat');
const User = require('../models/User');
const ListenerProfile = require('../models/ListenerProfile');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Start a new Chat Session
// @route   POST /api/chat/start
// @access  Private (Talker)
const startChat = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { listenerId, isPaid } = req.body;
        const talkerId = req.user.id;

        // 1. Check Listener Availability
        const listenerProfile = await ListenerProfile.findOne({ user: listenerId }).session(session);

        if (!listenerProfile) throw new Error('Listener not found');
        if (!listenerProfile.isOnline) throw new Error('Listener is offline');
        if (listenerProfile.isBusy) throw new Error('Listener is currently busy');

        // 2. Handle Payment (If Paid Session)
        let escrowId = null;
        let cost = 0;

        if (isPaid) {
            cost = listenerProfile.pricing.costPerSession || 500;
            const talker = await User.findById(talkerId).session(session);

            if (talker.wallet.balance < cost) {
                throw new Error('Insufficient coins for this listener');
            }

            // Deduct Coins & Create Escrow Record
            talker.wallet.balance -= cost;
            await talker.save({ session });

            const tx = await Transaction.create([{
                user: talkerId,
                amount: -cost,
                type: 'DEBIT',
                category: 'CHAT_PAYMENT',
                description: `Escrow for chat with listener`,
                status: 'PENDING',
                relatedUser: listenerId
            }], { session });

            escrowId = tx[0]._id;
        }

        // 3. Create Chat Session
        const chat = await Chat.create([{
            talker: talkerId,
            listener: listenerId,
            status: 'ACTIVE',
            startedAt: Date.now(),
            lastMessageAt: Date.now(),
            isPaidSession: isPaid,
            cost: cost,
            escrowTransactionId: escrowId
        }], { session });

        // 4. Lock the Listener
        listenerProfile.isBusy = true;
        await listenerProfile.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(chat[0]);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Get Chat Details (Participants & Status)
// @route   GET /api/chat/:id
// @access  Private (Participants Only)
const getChatDetails = async (req, res) => {
    try {
        const chatId = req.params.id;
        const userId = req.user.id;

        // Fetch chat and get details of both users
        // UPDATED: Added 'equippedFrame' to populate list
        const chat = await Chat.findById(chatId)
            .populate('talker', 'username avatar equippedFrame')
            .populate('listener', 'username avatar equippedFrame');

        if (!chat) {
            res.status(404);
            throw new Error('Chat not found');
        }

        // Security Check: Only allow participants to view
        const isTalker = chat.talker._id.toString() === userId;
        const isListener = chat.listener._id.toString() === userId;

        if (!isTalker && !isListener) {
            res.status(401);
            throw new Error('Not authorized to view this chat');
        }

        res.json(chat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    End Chat & Process Refund/Payment
// @route   POST /api/chat/end/:id
// @access  Private
const endChat = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const chatId = req.params.id;
        const { reason } = req.body;

        const chat = await Chat.findById(chatId).session(session);
        if (!chat) throw new Error('Chat not found');
        if (chat.status === 'COMPLETED' || chat.status === 'VOIDED') {
            throw new Error('Chat already ended');
        }

        // 1. Calculate Duration
        const duration = (Date.now() - new Date(chat.startedAt).getTime()) / 1000 / 60;

        // 2. Refund Logic
        let shouldRefund = false;
        if (chat.isPaidSession) {
            if (reason === 'TIMEOUT_SEENZONE') shouldRefund = true;
            else if (duration < 5 && reason === 'NETWORK_ERROR') shouldRefund = true;
        }

        // 3. Update Status
        chat.endedAt = Date.now();
        chat.disconnectReason = reason || 'VOLUNTARY';
        chat.status = shouldRefund ? 'VOIDED' : 'COMPLETED';
        chat.isFeedbackPending = true;

        await chat.save({ session });

        // 4. Money Transfer
        if (chat.isPaidSession && chat.escrowTransactionId) {
            if (shouldRefund) {
                // REFUND
                const talker = await User.findById(chat.talker).session(session);
                talker.wallet.balance += chat.cost;
                await talker.save({ session });

                await Transaction.create([{
                    user: chat.talker,
                    amount: chat.cost,
                    type: 'CREDIT',
                    category: 'REFUND',
                    description: `Refund for voided chat (Reason: ${reason})`,
                    relatedChat: chatId,
                    status: 'COMPLETED'
                }], { session });

            } else {
                // PAY (With 30% Commission)
                const listener = await User.findById(chat.listener).session(session);

                const commissionRate = 0.30;
                const platformFee = Math.floor(chat.cost * commissionRate);
                const netEarnings = chat.cost - platformFee;

                // Pay Listener
                listener.wallet.balance += netEarnings;
                listener.wallet.totalEarned += netEarnings;
                await listener.save({ session });

                await Transaction.create([{
                    user: chat.listener,
                    amount: netEarnings,
                    type: 'CREDIT',
                    category: 'CHAT_PAYMENT',
                    description: `Earnings from chat (Fees: ${platformFee})`,
                    relatedChat: chatId,
                    status: 'COMPLETED'
                }], { session });

                // Pay Admin
                const adminUser = await User.findOne({ 'roles.isAdmin': true }).session(session);
                if (adminUser) {
                    adminUser.wallet.balance += platformFee;
                    await adminUser.save({ session });

                    await Transaction.create([{
                        user: adminUser._id,
                        amount: platformFee,
                        type: 'CREDIT',
                        category: 'CHAT_PAYMENT',
                        description: `Platform Fee (30%) from Chat ID: ${chatId}`,
                        relatedChat: chatId,
                        status: 'COMPLETED'
                    }], { session });
                }
            }
        }

        // 5. Unlock Listener
        const listenerProfile = await ListenerProfile.findOne({ user: chat.listener }).session(session);
        if (listenerProfile) {
            listenerProfile.isBusy = false;
            if (!shouldRefund) {
                listenerProfile.stats.totalListenTime += Math.round(duration);
                listenerProfile.stats.chatsCompleted += 1;
            }
            await listenerProfile.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.json({ success: true, chat });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500);
        throw new Error(error.message);
    }
};

module.exports = { startChat, getChatDetails, endChat };