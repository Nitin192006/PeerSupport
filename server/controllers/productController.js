const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get all active products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { type } = req.query;

        let query = { isActive: true };
        if (type) {
            query.type = type;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500);
        throw new Error('Server Error: Could not fetch store items');
    }
};

// @desc    Buy an item
// @route   POST /api/products/purchase/:id
// @access  Private
const purchaseProduct = async (req, res) => {
    // 1. Start Atomic Session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productId = req.params.id;
        const userId = req.user.id;

        // 2. Fetch Data
        const product = await Product.findById(productId).session(session);
        const user = await User.findById(userId).session(session);

        if (!product) throw new Error('Product not found');
        if (!product.isActive) throw new Error('Product is no longer available');

        // 3. Check Inventory (Prevent duplicate buying)
        let alreadyOwned = false;

        if (product.type === 'STICKER_PACK') {
            alreadyOwned = user.inventory.stickerPacks.includes(product.id);
        } else if (product.type === 'PROFILE_FRAME') {
            alreadyOwned = user.inventory.frames.includes(product.id);
        } else if (product.type === 'THEME') {
            // NEW: Check Theme Inventory
            alreadyOwned = user.inventory.themes.includes(product.id);
        }

        if (alreadyOwned) {
            throw new Error('You already own this item');
        }

        // 4. Check Balance
        if (user.wallet.balance < product.price) {
            throw new Error('Insufficient coins');
        }

        // 5. EXECUTE SWAP
        // Deduct Money from User
        user.wallet.balance -= product.price;

        // Add to User Inventory
        if (product.type === 'STICKER_PACK') user.inventory.stickerPacks.push(product.id);
        if (product.type === 'PROFILE_FRAME') user.inventory.frames.push(product.id);
        if (product.type === 'THEME') user.inventory.themes.push(product.id); // NEW

        await user.save({ session });

        // 6. Record User Debit Transaction
        await Transaction.create([{
            user: userId,
            amount: -product.price,
            type: 'DEBIT',
            category: 'STORE_PURCHASE',
            description: `Bought ${product.name}`,
            status: 'COMPLETED'
        }], { session });

        // --- REVENUE COLLECTION START ---
        // Find Admin/Treasury
        const adminUser = await User.findOne({ 'roles.isAdmin': true }).session(session);

        if (adminUser) {
            // Credit Admin Wallet (100% of price)
            adminUser.wallet.balance += product.price;
            await adminUser.save({ session });

            // Record Revenue Transaction
            await Transaction.create([{
                user: adminUser._id,
                amount: product.price,
                type: 'CREDIT',
                category: 'STORE_PURCHASE',
                description: `Revenue from sale of ${product.name}`,
                relatedUser: userId,
                status: 'COMPLETED'
            }], { session });
        }
        // --- REVENUE COLLECTION END ---

        // Commit (Save)
        await session.commitTransaction();
        session.endSession();

        res.json({
            success: true,
            message: `Successfully purchased ${product.name}`,
            newBalance: user.wallet.balance,
            inventory: user.inventory
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Admin: Create a new product (With Cloudinary Upload)
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = async (req, res) => {
    try {
        const { name, type, price } = req.body;
        let thumbnailUrl = req.body.thumbnailUrl || '';
        let assets = [];

        // 1. Handle File Upload (Thumbnail/Asset)
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'peer-support-store',
            });

            thumbnailUrl = result.secure_url;

            // For Themes and Single-Asset packs, the main asset is the uploaded file
            assets.push(result.secure_url);

            fs.unlinkSync(req.file.path);
        }

        // 2. Create Database Entry
        const product = await Product.create({
            name,
            type,
            price,
            thumbnailUrl,
            assets
        });

        res.status(201).json(product);
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error(error);
        res.status(400);
        throw new Error('Invalid product data or upload failed');
    }
};

module.exports = { getProducts, purchaseProduct, createProduct };