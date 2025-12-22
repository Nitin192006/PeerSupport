const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    // --- PARTICIPANTS ---
    talker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listener: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // --- SESSION STATUS ---
    status: {
        type: String,
        enum: ['REQUESTED', 'ACTIVE', 'COMPLETED', 'VOIDED', 'ENDED_BY_TALKER', 'ENDED_BY_LISTENER'],
        default: 'REQUESTED'
    },

    // --- ECONOMY LINK ---
    isPaidSession: { type: Boolean, default: false },
    escrowTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }, // Coins held in limbo
    cost: { type: Number, default: 0 },

    // --- TIMESTAMPS (Crucial for Refund Algo) ---
    startedAt: { type: Date },
    endedAt: { type: Date },
    lastMessageAt: { type: Date }, // Used for Anti-Seen-Zone Logic to track silence

    // --- DISCONNECT LOGIC ---
    // This field helps the refund service decide if money goes back to Talker
    disconnectReason: {
        type: String,
        enum: ['VOLUNTARY', 'NETWORK_ERROR', 'TIMEOUT_SEENZONE', 'NONE'],
        default: 'NONE'
    },

    // --- FEEDBACK GATE ---
    // If true, the UI forces the Talker to rate before navigating away
    isFeedbackPending: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);