const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // --- IDENTITY ---
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, select: false },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "https://res.cloudinary.com/demo/image/upload/v1/default_avatar.png" },

    // NEW: The currently active frame URL
    equippedFrame: { type: String, default: "" },

    // --- ROLES ---
    roles: { isListener: { type: Boolean, default: false }, isAdmin: { type: Boolean, default: false } },
    activeRole: { type: String, enum: ['talker', 'listener'], default: 'talker' },
    listenerProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ListenerProfile' },

    // --- ECONOMY ---
    wallet: {
        balance: { type: Number, default: 100 },
        gems: { type: Number, default: 0 },
        totalEarned: { type: Number, default: 0 }
    },
    inventory: {
        badges: [{ type: String }],
        stickerPacks: [{ type: String }],
        frames: [{ type: String }], // Array of Owned Frame IDs
        themes: [{ type: String }]  // Array of Owned Theme IDs
    },

    // --- SETTINGS ---
    settings: {
        anonymousMode: { type: Boolean, default: true },
        autoDelete: { type: Boolean, default: false },
        allowVoice: { type: Boolean, default: true }
    },

    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }

}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);