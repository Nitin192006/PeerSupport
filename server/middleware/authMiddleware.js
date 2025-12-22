const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Simple wrapper to handle async errors
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if the header has "Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (remove "Bearer " string)
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get User from the ID in the token
            // Exclude the password from the data we attach to the request
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the Controller
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };