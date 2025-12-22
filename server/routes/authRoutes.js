const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    updateUserProfile,
    updateSettings,
    deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// 1. Register
router.post('/register', registerUser);

// 2. Login
router.post('/login', loginUser);

// 3. Update Profile (Protected - JSON only)
// UPDATED: Removed 'upload.single' middleware. Now just a standard PUT request.
router.put('/profile', protect, updateUserProfile);

// 4. Update Settings
router.put('/settings', protect, updateSettings);

// 5. Delete Account
router.delete('/account', protect, deleteAccount);

module.exports = router;