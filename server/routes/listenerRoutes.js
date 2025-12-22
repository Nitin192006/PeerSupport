const express = require('express');
const router = express.Router();
const { getListeners, updateProfile, toggleStatus } = require('../controllers/listenerController');
const { protect } = require('../middleware/authMiddleware');

// 1. Matchmaking Route
// GET /api/listeners?tag=Anxiety
// Fetches the sorted list of listeners based on the Bayesian Algorithm
router.get('/', protect, getListeners);

// 2. Profile Management
// PUT /api/listeners/profile
// Updates tags and settings
router.put('/profile', protect, updateProfile);

// 3. Availability Toggle
// PUT /api/listeners/status
// Switches the user between Online/Offline
router.put('/status', protect, toggleStatus);

module.exports = router;