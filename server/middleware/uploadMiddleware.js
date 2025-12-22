const multer = require('multer');
const path = require('path');

// 1. Configure Storage (Temporary Local Storage)
// We save files to 'server/uploads' first. 
// This ensures the server receives the full file before trying to send it to the cloud.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure the 'server/uploads' folder exists
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.extension
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// 2. File Filter (Security)
// Only allow images. Prevent users from uploading .exe or scripts.
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only (jpeg, jpg, png, gif, webp)!'));
    }
}

// 3. Initialize Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;