require('dotenv').config({ path: '../.env' }); // Load env variables from parent folder
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const connectDB = require('../config/db');

// --- CONFIGURATION ---
// Change these credentials to whatever you want your "Master Account" to be.
const ADMIN_CREDENTIALS = {
    username: "Platform_Treasury",
    email: "admin@peersupport.com",
    password: "secure_admin_password_123",
    roles: { isListener: false, isAdmin: true },
    wallet: { balance: 1000000 } // Initial float for the treasury
};

const seedAdmin = async () => {
    try {
        // 1. Connect to Database
        await connectDB();

        // 2. Check if Admin already exists
        const exists = await User.findOne({ email: ADMIN_CREDENTIALS.email });
        if (exists) {
            console.log('⚠️  Admin Account already exists. No action taken.');
            process.exit();
        }

        // 3. Create the Admin User
        // Note: The User model's pre-save hook will automatically hash the password
        const admin = await User.create(ADMIN_CREDENTIALS);

        // 4. Create Initial Ledger Record
        // This ensures the initial balance has a transaction history
        await Transaction.create({
            user: admin._id,
            amount: ADMIN_CREDENTIALS.wallet.balance,
            type: 'CREDIT',
            category: 'TOP_UP',
            description: 'Initial Treasury Seeding',
            status: 'COMPLETED'
        });

        console.log('✅ Treasury Account Created Successfully!');
        console.log('-----------------------------------');
        console.log(`📧 Email:    ${ADMIN_CREDENTIALS.email}`);
        console.log(`🔑 Password: ${ADMIN_CREDENTIALS.password}`);
        console.log('-----------------------------------');

        process.exit();

    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();