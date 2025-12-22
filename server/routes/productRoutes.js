const express = require('express');
const router = express.Router();
const { getProducts, purchaseProduct, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import Multer Config

// 1. Browse Store
// GET /api/products
router.get('/', getProducts);

// 2. Buy Item
// POST /api/products/purchase/:id
router.post('/purchase/:id', protect, purchaseProduct);

// 3. Admin: Add Item (Now supports file upload)
// POST /api/products
// We expect a form-data field named 'image' containing the thumbnail
router.post('/', protect, upload.single('image'), createProduct);

module.exports = router;