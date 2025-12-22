# PeerSupport 🫂  
*A Gamified Mentorship & Mental Wellness Ecosystem*

PeerSupport is an ambitious full-stack mentorship ecosystem designed to bridge the gap between human vulnerability and digital connection. Through a game-first, non-intimidating experience, the platform transforms emotional support into a rewarding, community-driven journey—where empathy is valued, participation is incentivized, and care becomes a sustainable economy.

At the heart of the experience is the Aether UI Engine — a proprietary rendering philosophy that rejects sterile, clinical web design in favor of a high-fidelity, bitmap-driven “Skinned” interface. This intentional aesthetic lowers psychological barriers for users (Talkers), making it easier to open up and engage authentically.

Behind the scenes, a robust MERN-based backend powers a two-sided marketplace where Listeners provide real-time support, earn Karma, and build reputation within a self-sustaining ecosystem of care.

---

## Core Concepts

- Talkers – Users seeking support in a welcoming, non-clinical environment  
- Listeners – Vetted mentors who provide empathy and earn rewards  
- Karma System – Reputation and progression layer for Listeners  
- Digital Wallet – Secure FinTech layer for tips, rewards, and purchases  
- Community Store – Stickers & sounds that make emotions tangible  
- Aether UI Engine – Bitmap-driven UI philosophy focused on comfort & immersion  

---

## Key Features

- Real-time chat between Talkers and Listeners  
- Secure digital wallet & transactional ledger  
- In-app store for stickers, sounds, and UI interactions  
- Sticker Drawer & sound effects for emotional expression  
- Modular backend controllers for scalability  
- Cloudinary-powered media upload pipelines  
- Mongoose-backed financial integrity and data safety  
- Listener vetting & role-based access control  

---

## Tech Stack

Frontend:
- React
- Tailwind CSS
- Custom Aether UI Engine
- Context API

Backend:
- Node.js
- Express
- MongoDB + Mongoose
- Cloudinary
- JWT Authentication

---

## Project Structure

PeerSupportStartup/
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── listenerController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   └── walletController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Chat.js
│   │   ├── ListenerProfile.js
│   │   ├── Product.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── listenerRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   └── walletRoutes.js
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   │   └── seeAdmin.js
│   ├── .env
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
│
└── client/
    ├── public/
    │   └── assets/
    │       ├── avatars/
    │       ├── sounds/
    │       ├── stickers/
    │       ├── ui/
    │       └── assets.js
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   └── UserAvatar.js
    │   │   └── features/
    │   │       ├── BecomeListenerModal.js
    │   │       ├── EditProfileModal.js
    │   │       ├── ListenerGrid.js
    │   │       ├── StickerDrawer.js
    │   │       └── TipModal.js
    │   ├── context/
    │   │   └── ThemeContext.js
    │   ├── hooks/
    │   ├── pages/
    │   │   ├── AdminDashboard.js
    │   │   ├── ChatRoom.js
    │   │   ├── Dashboard.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Settings.js
    │   │   ├── Store.js
    │   │   ├── Terms.js
    │   │   └── Wallet.js
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── chatService.js
    │   │   ├── listenerService.js
    │   │   └── paymentService.js
    │   ├── styles/
    │   ├── theme/
    │   │   └── default.js
    │   ├── utils/
    │   ├── App.js
    │   └── index.css
    ├── package-lock.json
    ├── package.json
    └── tailwind.config.js

---

## Getting Started

Installation:

git clone https://github.com/yourusername/PeerSupportStartup.git  
cd PeerSupportStartup  

Run Server:

cd server  
npm install  
npm run dev  

Run Client:

cd client  
npm install  
npm run dev  

---

## Vision

PeerSupport transforms traditional support groups into a thriving, sensory-rich sanctuary—where empathy is interactive, progress is visible, and care is rewarded.

---