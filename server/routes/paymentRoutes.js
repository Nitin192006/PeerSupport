const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// 1. Create Order (Initiate Payment)
// POST /api/payment/create-order
router.post('/create-order', protect, createPaymentOrder);

// 2. Verify Payment (Complete Transaction)
// POST /api/payment/verify
router.post('/verify', protect, verifyPayment);

module.exports = router;