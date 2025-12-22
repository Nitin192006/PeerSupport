# 🫂 PeerSupport — Gamified Mentorship & Wellness Platform

[![MERN](https://img.shields.io/badge/Stack-MERN-10b981?style=for-the-badge)](https://mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![FinTech](https://img.shields.io/badge/Layer-FinTech-8b5cf6?style=for-the-badge)](#)

PeerSupport is a full-stack mentorship and emotional wellness ecosystem built on the MERN stack. It reimagines digital support spaces through a **game-first, non-clinical experience**, transforming empathy into a rewarding, sustainable interaction model.

Rather than sterile interfaces, PeerSupport focuses on comfort, immersion, and emotional expression—bridging human vulnerability with modern, high-integrity engineering.

---

## 🌌 Product Philosophy

### Aether UI Engine
PeerSupport is powered by the **Aether UI Engine**, a proprietary frontend design philosophy that replaces clinical UX patterns with a **bitmap-driven, skinned interface** inspired by games and virtual worlds.

The intent is deliberate:
Lower psychological barriers, encourage openness, and make emotional interaction feel safe, expressive, and human.

---

## 🧠 Core Concepts

- **Talkers** — Users seeking guidance, mentorship, or emotional support
- **Listeners** — Vetted mentors who provide real-time empathy
- **Karma System** — Reputation and progression for Listeners
- **Digital Wallet** — Secure reward and tipping infrastructure
- **Community Store** — Stickers and sounds that make emotions tangible

---

## 🛠️ Engineering Highlights

- **Two-Sided Marketplace Architecture**  
  Clean separation between Talker and Listener roles with permission-based access.

- **Service-Oriented Backend**  
  Modular controller-service pattern for scalability and maintainability.

- **Secure FinTech Layer**  
  Digital wallet, transactional ledger, and purchase flows backed by Mongoose integrity guarantees.

- **Expressive Interaction Layer**  
  Sticker Drawer and sound effects for non-verbal emotional communication.

- **Cloudinary Media Pipelines**  
  Custom upload handling for avatars and digital assets.

- **JWT-Based Authentication**  
  Secure, stateless auth with role-aware middleware.

---

## 🧱 Tech Stack

### Frontend
- React
- Tailwind CSS
- Context API
- Custom Aether UI Theming System

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Cloudinary
- JWT Authentication

---

## 📂 Project Architecture

```text
PeerSupportStartup/
├── server/                     # Backend Application (Node / Express)
│   ├── config/                 # Database & Cloudinary configuration
│   ├── controllers/            # Business logic (auth, chat, wallet)
│   ├── middleware/             # Auth, error handling, uploads
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API endpoint definitions
│   ├── services/               # External service abstractions
│   ├── uploads/                # Temporary media storage (gitignored)
│   ├── utils/                  # Helper utilities
│   ├── index.js                # Server entry point
│   └── .env                    # Environment variables (protected)
│
└── client/                     # Frontend Application (React)
    ├── public/assets/          # Avatars, stickers, sounds, UI assets
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── context/            # Global state & theming
    │   ├── pages/              # Application views
    │   ├── services/           # API & domain services
    │   ├── theme/              # Aether UI theme definitions
    │   ├── utils/              # Frontend helpers
    │   ├── App.js              # Root application component
    │   └── index.css           # Global styles
    └── tailwind.config.js
```

---

## 🚀 Installation & Setup

### Backend
```bash
cd server
npm install
# Configure .env with MongoDB URI, JWT secret, Cloudinary keys
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🔮 Vision

PeerSupport aims to evolve traditional support groups into a **living digital sanctuary**—where care is interactive, trust is rewarded, and emotional labor is respected.

This is not just a chat application.  
It is a self-sustaining ecosystem built around empathy, safety, and meaningful connection.

---

## 📝 Author

Designed and engineered by **Nitin**  
Built with a focus on human-centered systems, scalable architecture, and emotional integrity.

---