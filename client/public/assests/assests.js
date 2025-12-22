// --- ACTION REQUIRED: Upload your assets to a cloud provider first ---
// Examples: Cloudinary, AWS S3, Firebase Storage, or Imgur
const CLOUD_BASE_URL = "https://your-cloud-provider.com/my-app-assets";

export const STICKERS = {
    // --- ACTION REQUIRED: See Checklist Section 2.D (Stickers) ---
    // Map your sticker names to their specific filenames
    happy: `${CLOUD_BASE_URL}/stickers/happy-robot.png`,     // REPLACE filename
    sad: `${CLOUD_BASE_URL}/stickers/sad-robot.png`,         // REPLACE filename
    thumbsUp: `${CLOUD_BASE_URL}/stickers/thumbs-up.png`,    // REPLACE filename
    celebrate: `${CLOUD_BASE_URL}/stickers/confetti.gif`,    // REPLACE filename
};

export const AVATARS = {
    // --- ACTION REQUIRED: See Checklist Section 2.D (Avatars) ---
    systemBot: `${CLOUD_BASE_URL}/avatars/bot-assistant.png`, // REPLACE filename
    defaultUser: `${CLOUD_BASE_URL}/avatars/user-gray.png`,   // REPLACE filename
};

export const ILLUSTRATIONS = {
    // --- ACTION REQUIRED: See Checklist Section 2.D (Illustrations) ---
    heroImage: `${CLOUD_BASE_URL}/illustrations/landing-hero.svg`, // REPLACE filename
    emptyState: `${CLOUD_BASE_URL}/illustrations/no-data.svg`,     // REPLACE filename
};