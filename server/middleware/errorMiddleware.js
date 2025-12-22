// 1. Handle 404: "Page Not Found"
// If a user hits a route that doesn't exist (e.g. /api/users/wrong-id), this triggers.
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Set status to 404
    next(error); // Pass error to the next handler
};

// 2. Global Error Handler
// Catches any error thrown in the app (DB errors, Auth errors)
const errorHandler = (err, req, res, next) => {
    // Sometimes an error is thrown but status is still 200; force it to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);
    res.json({
        success: false,
        message: err.message,
        // Security: Hide the detailed error stack in Production
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };