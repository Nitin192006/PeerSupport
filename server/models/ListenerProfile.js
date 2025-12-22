const mongoose = require('mongoose');

const ListenerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // --- AVAILABILITY ---
    isOnline: { type: Boolean, default: false },
    isBusy: { type: Boolean, default: false }, // In a chat
    lastActive: { type: Date, default: Date.now },

    // --- MATCHMAKING DATA ---
    tags: [{
        type: String,
        enum: ['Anxiety', 'Depression', 'Relationships', 'Career', 'LGBTQ+', 'Venting', 'School']
    }],
    languages: [{ type: String, default: 'English' }],

    // --- RANKING ALGORITHM DATA ---
    rating: {
        average: { type: Number, default: 0 }, // Raw average
        count: { type: Number, default: 0 },   // Number of reviews
        bayesianScore: { type: Number, default: 0 } // The "Smart Sort" Score used for sorting
    },
    stats: {
        totalListenTime: { type: Number, default: 0 }, // In minutes
        chatsCompleted: { type: Number, default: 0 },
        ghostingIncidents: { type: Number, default: 0 } // Times they seen-zoned someone
    },

    // --- PROGRESSION ---
    rank: {
        type: String,
        enum: ['Novice', 'Apprentice', 'Guide', 'Sage', 'Master'],
        default: 'Novice'
    },

    // --- ECONOMY SETTINGS ---
    pricing: {
        isBookable: { type: Boolean, default: false }, // Unlocked at 'Guide' rank
        costPerSession: { type: Number, default: 0 }
    }

}, { timestamps: true });

// Index for fast searching (Find online listeners with specific tags)
ListenerProfileSchema.index({ isOnline: 1, isBusy: 1, tags: 1, bayesianScore: -1 });

module.exports = mongoose.model('ListenerProfile', ListenerProfileSchema);