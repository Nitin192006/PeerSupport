const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Who owns this record?
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // --- MOVEMENT DETAILS ---
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'], // CREDIT = Money In, DEBIT = Money Out
        required: true
    },
    category: {
        type: String,
        enum: ['WELCOME_BONUS', 'CHAT_PAYMENT', 'TIP_SENT', 'TIP_RECEIVED', 'STORE_PURCHASE', 'REFUND', 'TOP_UP'],
        required: true
    },

    // --- CONTEXT ---
    description: { type: String, required: true }, // e.g., "Tip to Luna_Listen"
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'COMPLETED'
    },

    // Links to other items (Optional based on category)
    // If it was a tip, who was it for?
    relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // If it was a booking, which chat session?
    relatedChat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }

}, { timestamps: true });

// Index for fast "History" loading
TransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);