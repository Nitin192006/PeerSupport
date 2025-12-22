const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Initialize Razorpay
// Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Define your Coin Bundles (Pricing in INR)
const COIN_PACKAGES = {
    'pack_small': { coins: 100, price: 100, name: 'Handful of Coins' },   // ₹100
    'pack_medium': { coins: 550, price: 500, name: 'Bag of Coins' },      // ₹500 (10% Bonus)
    'pack_large': { coins: 1200, price: 1000, name: 'Chest of Coins' },   // ₹1000 (20% Bonus)
    'pack_mega': { coins: 3000, price: 2000, name: 'Vault of Coins' }     // ₹2000 (50% Bonus)
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order (Renamed from create-session)
// @access  Private
const createPaymentOrder = async (req, res) => {
    try {
        const { packageId } = req.body;
        const pack = COIN_PACKAGES[packageId];

        if (!pack) {
            res.status(400);
            throw new Error('Invalid Coin Package');
        }

        // Razorpay expects amount in "paise" (1 INR = 100 paise)
        const options = {
            amount: pack.price * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}_${req.user.id}`,
            notes: {
                userId: req.user.id,
                packageId: packageId,
                coinsAmount: pack.coins
            }
        };

        const order = await razorpay.orders.create(options);

        // Send Order ID and details to frontend to open the Payment Modal
        res.json({
            orderId: order.id,
            amount: pack.price * 100,
            currency: "INR",
            coins: pack.coins,
            keyId: process.env.RAZORPAY_KEY_ID // Frontend needs this to open modal
        });

    } catch (error) {
        res.status(500);
        throw new Error(error.message || "Razorpay Order Creation Failed");
    }
};

// @desc    Verify Razorpay Signature & Credit Coins
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packageId } = req.body;
        const userId = req.user.id;

        // 1. Verify Signature (Security Check)
        // We create a hash of order_id + "|" + payment_id using our secret
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            throw new Error('Invalid Payment Signature. Potential Fraud Attempt.');
        }

        // 2. Identify Package
        const pack = COIN_PACKAGES[packageId];
        if (!pack) throw new Error('Invalid Package Reference');

        // 3. Credit User Wallet
        const user = await User.findById(userId).session(session);
        user.wallet.balance += pack.coins;
        await user.save({ session });

        // 4. Record Transaction
        await Transaction.create([{
            user: userId,
            amount: pack.coins,
            type: 'CREDIT',
            category: 'TOP_UP',
            description: `Purchased ${pack.coins} Coins via Razorpay`,
            status: 'COMPLETED'
        }], { session });

        // --- REVENUE LOGIC: The Admin gets the Real Money (Razorpay Dashboard) ---
        // Just like Stripe, the actual money is in your Razorpay account.
        // We just track the virtual coin injection here.

        await session.commitTransaction();
        session.endSession();

        res.json({ success: true, newBalance: user.wallet.balance });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400);
        throw new Error(error.message || 'Payment Verification Failed');
    }
};

module.exports = { createPaymentOrder, verifyPayment };