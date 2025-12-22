const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. Register
const registerUser = async (req, res) => {
    let createdUser = null;
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400); throw new Error('Please include all fields');
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400); throw new Error('User already exists');
        }

        createdUser = await User.create({
            username, email, password, wallet: { balance: 100 }
        });

        if (createdUser) {
            await Transaction.create({
                user: createdUser._id, amount: 100, type: 'CREDIT', category: 'WELCOME_BONUS',
                description: 'Welcome to PeerSupport!', status: 'COMPLETED'
            });

            res.status(201).json({
                _id: createdUser._id, username: createdUser.username, email: createdUser.email,
                avatar: createdUser.avatar, wallet: createdUser.wallet, roles: createdUser.roles,
                settings: createdUser.settings,
                equippedFrame: createdUser.equippedFrame, // Return frame
                token: generateToken(createdUser._id),
            });
        }
    } catch (error) {
        if (createdUser) await User.findByIdAndDelete(createdUser._id);
        res.status(400); throw new Error(error.message || 'Registration failed');
    }
};

// 2. Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id, username: user.username, email: user.email,
                avatar: user.avatar, wallet: user.wallet, roles: user.roles,
                settings: user.settings,
                equippedFrame: user.equippedFrame, // Return frame
                inventory: user.inventory,
                token: generateToken(user._id),
            });
        } else {
            res.status(401); throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(401); throw new Error(error.message);
    }
};

// 3. Update Profile (Selection Only - No File Upload)
// Accepts { username, email, avatar: "https://...", equippedFrame: "https://..." }
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) { res.status(404); throw new Error('User not found'); }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        // Update Avatar String
        if (req.body.avatar) {
            user.avatar = req.body.avatar;
        }

        // NEW: Update Equipped Frame String
        // (Allows setting it to "" to unequip)
        if (req.body.equippedFrame !== undefined) {
            user.equippedFrame = req.body.equippedFrame;
        }

        if (req.body.password) user.password = req.body.password;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id, username: updatedUser.username, email: updatedUser.email,
            avatar: updatedUser.avatar, wallet: updatedUser.wallet, roles: updatedUser.roles,
            settings: updatedUser.settings,
            equippedFrame: updatedUser.equippedFrame, // Return updated frame
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(400); throw new Error(error.message || 'Update failed');
    }
};

// 4. Update Settings
const updateSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) { res.status(404); throw new Error('User not found'); }
        user.settings = { ...user.settings, ...req.body };
        const updatedUser = await user.save();
        res.json(updatedUser.settings);
    } catch (error) {
        res.status(400); throw new Error(error.message);
    }
};

// 5. Delete Account
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) { res.status(404); throw new Error('User not found'); }
        await user.deleteOne();
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500); throw new Error(error.message);
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, updateSettings, deleteAccount };