const express = require('express');
const router = express.Router();
const { getWallet, sendTip } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

// 1. View Wallet & History
// GET /api/wallet
router.get('/', protect, getWallet);

// 2. Send Money (Tip)
// POST /api/wallet/tip
router.post('/tip', protect, sendTip);

// REMOVED: /bonus route (Strict Economy Enforced)

module.exports = router;