# 🤝 PeerSupport: Gamified Community Platform & Custom UI Engine

![Status](https://img.shields.io/badge/Status-Active%20Development-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Context%20API-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Focus](https://img.shields.io/badge/Focus-System%20Architecture%20%26%20UX-blueviolet?style=for-the-badge)

## 📖 Executive Summary

**PeerSupport** is a production-grade web application designed to connect users for mentorship and community support within a highly immersive, gamified environment. 

Unlike traditional platforms that rely on standard browser styling (CSS/Tailwind), PeerSupport features a **Custom Asset-Rendering Engine** engineered from scratch. This project demonstrates complex frontend architecture by decoupling the "Business Logic" (User matching, authentication, real-time data) from a "Presentation Layer" that renders interactive elements using high-fidelity bitmap assets, simulating the responsive feel of a native video game UI on the web.

> **Engineering Goal:** To showcase proficiency in React architecture, state management, and DOM manipulation by building a proprietary rendering system that bypasses standard CSS limitations.

---

## 🌟 Key Technical Features

### 1. Proprietary UI Engine (The "Skin")
* **Asset-Based Rendering Pipeline:** Developed a custom React component library where UI primitives (Buttons, Inputs, Modals) are rendered via a dynamic asset manifest. This allows for instant "Hot-Swapping" of visual themes (e.g., swapping from "Cyberpunk" to "Minimalist") without altering a single line of business logic.
* **State-Driven Sprite Animation:** Components utilize internal state machines to handle micro-interactions (Hover, Active, Focus, Disabled), swapping sprite assets instantly for zero-latency visual feedback.
* **9-Slice Scaling Implementation:** (In Development) Custom algorithms to programmatically slice and stretch bitmap assets, ensuring UI containers remain crisp across responsive viewports.

### 2. Functional Architecture (The Core)
* **Role-Based Authentication:** Secure simulation of distinct user roles (Guest, User, Admin) with protected route guards preventing unauthorized access to the Dashboard and Session areas.
* **Global State Management:** Leverages **React Context API** and custom hooks (`useAuth`, `useToast`) to manage session data and application-wide notifications, avoiding prop-drilling.
* **Real-Time Feedback Loops:** A custom Toast Notification system built from scratch to provide immediate, animated feedback for user actions (form submissions, connection requests).

### 3. User Experience (UX) Strategy
* **Gamified Interaction:** The interface design promotes engagement through "juicy" UI interactions, using visual metaphors (stickers, badges) typically found in gaming to reduce the friction of seeking support.
* **Immersive Environment:** Full-screen responsive wallpapers and texture overlays that adapt to mobile and desktop resolutions.

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 18 (Vite)
* **Language:** JavaScript (ES6+) / JSX
* **Styling Architecture:** Zero-CSS Library (Custom Asset Rendering + Inline Layouts)
* **State Management:** Context API + useReducer
* **Routing:** React Router DOM (with Protected Route patterns)

---

## 📂 Project Structure

The codebase adheres to a strict "Separation of Concerns" philosophy:

```text
src/
├── assets/                  # The Visual Skin (60+ Unique Bitmap Assets)
│   ├── buttons/             # Interactive sprites (Idle, Hover, Active)
│   ├── panels/              # 9-slice compatible containers
│   └── environment/         # High-res textures and wallpapers
├── config/
│   └── manifest.js          # The Registry mapping logic states to asset paths
├── components/
│   ├── engine/              # The Rendering Core (SkinnedButton, SkinnedPanel)
│   ├── layout/              # Structural components (Dashboard, Sidebar)
│   └── logic/               # Headless logic (AuthGuard, DataProviders)
├── views/
│   ├── Landing.jsx          # Public entry point
│   └── UserDashboard.jsx    # Private session area
└── App.jsx                  # Main Controller
```

---

## 🚀 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/yourusername/peersupport-platform.git](https://github.com/yourusername/peersupport-platform.git)
    cd peersupport-platform
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Asset Verification**
    * Ensure the `/public/assets` directory contains the required texture packs.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🗺️ Development Roadmap

- [x] **Phase 1: Core Architecture** - React setup, Routing, and Authentication logic.
- [x] **Phase 2: Rendering Engine Alpha** - Basic bitmap swapping for Buttons and Inputs.
- [ ] **Phase 3: Community Features** - Implement real-time chat simulation and user matching logic.
- [ ] **Phase 4: Advanced Skinning** - Complete 9-slice scaling algorithm for dynamic containers.

---

## 🧠 Learning Outcomes

This project served as a deep dive into advanced Frontend Engineering:
1.  **System Design:** Designing a scalable component API that abstracts complex rendering logic away from the developer.
2.  **Performance Optimization:** Managing asset preloading and memory usage to ensure 60FPS performance despite heavy image usage.
3.  **Accessibility (a11y):** Ensuring that a non-standard, image-heavy interface remains semantic and accessible to screen readers via proper ARIA attributes.

---

*Project created for academic demonstration and internship portfolio.*