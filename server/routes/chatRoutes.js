const express = require('express');
const router = express.Router();
const { startChat, endChat, getChatDetails } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// 1. Start a Session (Locks Listener & Escrow)
// POST /api/chat/start
router.post('/start', protect, startChat);

// 2. Get Chat Details (Fetch Partner Info & Status)
// GET /api/chat/:id
router.get('/:id', protect, getChatDetails);

// 3. End a Session (Processes Payment/Refund/Commission)
// POST /api/chat/end/:id
router.post('/end/:id', protect, endChat);

module.exports = router;