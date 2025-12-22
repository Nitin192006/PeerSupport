const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // process.env.MONGO_URI will be loaded from your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Enterprise Stability Settings:
            // If DB doesn't respond in 5s, fail fast so the server manager can restart it
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        // Exit process with failure (1) so your cloud provider knows to restart the server
        process.exit(1);
    }
};

module.exports = connectDB;