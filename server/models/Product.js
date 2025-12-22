const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // --- DISPLAY INFO ---
    name: { type: String, required: true },
    description: { type: String },
    thumbnailUrl: { type: String, required: true }, // Preview image for the store

    // --- CONFIGURATION ---
    type: {
        type: String,
        // UPDATED: Added 'THEME' to allow uploading UI Themes
        enum: ['STICKER_PACK', 'PROFILE_FRAME', 'CHAT_BUBBLE', 'AVATAR_PACK', 'THEME'],
        required: true
    },
    price: { type: Number, required: true }, // Cost in Coins

    // --- ASSETS ---
    // The actual content (e.g., Array of sticker image URLs)
    // For Themes: [0]=Bg, [1]=Panel, [2]=Btn
    assets: [{ type: String }],

    // --- AVAILABILITY ---
    isActive: { type: Boolean, default: true }, // If false, hidden from store
    isPremium: { type: Boolean, default: false } // Future-proofing for "Gem-only" items

}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);