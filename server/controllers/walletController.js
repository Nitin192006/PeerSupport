const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get Wallet Balance & History
// @route   GET /api/wallet
// @access  Private
const getWallet = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get current balance
        const user = await User.findById(userId).select('wallet');

        // 2. Get History (Last 50 transactions)
        const history = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            balance: user.wallet.balance,
            gems: user.wallet.gems,
            history: history
        });

    } catch (error) {
        res.status(500);
        throw new Error('Server Error: Could not fetch wallet');
    }
};

// @desc    Send a Tip (P2P Transfer with Commission)
// @route   POST /api/wallet/tip
// @access  Private
const sendTip = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { recipientId, amount } = req.body;
        const senderId = req.user.id;

        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        // 1. Fetch Sender (Atomic Lock)
        const sender = await User.findById(senderId).session(session);
        if (sender.wallet.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // 2. Fetch Recipient
        const recipient = await User.findById(recipientId).session(session);
        if (!recipient) {
            throw new Error('Recipient not found');
        }

        // 3. TRANSFER LOGIC WITH COMMISSION
        // Platform Fee Calculation (30%)
        const commissionRate = 0.30;
        const platformFee = Math.floor(amount * commissionRate);
        const netReceived = amount - platformFee;

        // Deduct FULL amount from Sender
        sender.wallet.balance -= amount;
        await sender.save({ session });

        // Add NET amount to Recipient
        recipient.wallet.balance += netReceived;
        recipient.wallet.totalEarned += netReceived; // Track lifetime earnings for Ranking
        await recipient.save({ session });

        // --- REVENUE COLLECTION (Credit Admin) ---
        const adminUser = await User.findOne({ 'roles.isAdmin': true }).session(session);

        if (adminUser) {
            adminUser.wallet.balance += platformFee;
            await adminUser.save({ session });

            // Record Revenue
            await Transaction.create([{
                user: adminUser._id,
                amount: platformFee,
                type: 'CREDIT',
                category: 'TIP_RECEIVED',
                description: `Platform Fee (30%) from transfer: ${sender.username} -> ${recipient.username}`,
                relatedUser: senderId,
                status: 'COMPLETED'
            }], { session });
        }

        // 4. LEDGER: Debit Sender
        await Transaction.create([{
            user: senderId,
            amount: -amount,
            type: 'DEBIT',
            category: 'TIP_SENT',
            description: `Tip sent to ${recipient.username}`,
            relatedUser: recipientId,
            status: 'COMPLETED'
        }], { session });

        // 5. LEDGER: Credit Recipient
        await Transaction.create([{
            user: recipientId,
            amount: netReceived,
            type: 'CREDIT',
            category: 'TIP_RECEIVED',
            description: `Tip received from ${sender.username} (Fee: ${platformFee})`,
            relatedUser: senderId,
            status: 'COMPLETED'
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.json({
            success: true,
            newBalance: sender.wallet.balance,
            message: `Sent ${amount} coins. Recipient received ${netReceived}.`
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(400);
        throw new Error(error.message || 'Tip transfer failed');
    }
};

module.exports = { getWallet, sendTip };