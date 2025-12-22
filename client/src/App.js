import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import ChatRoom from './pages/ChatRoom';
import Store from './pages/Store';
import Wallet from './pages/Wallet';
import AdminDashboard from './pages/AdminDashboard'; // Import Admin Page

function App() {
    return (
        <ThemeProvider>
            <Router>
                {/* Dynamic Theme Classes Applied Here */}
                <div className="min-h-screen w-full bg-skin-app font-main text-skin-text transition-all duration-300 bg-cover bg-center bg-no-repeat bg-fixed">

                    <Routes>
                        {/* PUBLIC ROUTES */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/terms" element={<Terms />} />

                        {/* PROTECTED ROUTES */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/chat/:id" element={<ChatRoom />} />
                        <Route path="/store" element={<Store />} />
                        <Route path="/wallet" element={<Wallet />} />

                        {/* ADMIN ROUTE (Protected by check inside component) */}
                        <Route path="/admin" element={<AdminDashboard />} />

                        {/* 404 FALLBACK */}
                        <Route path="*" element={
                            <div className="flex items-center justify-center h-screen text-skin-muted font-bold text-xl">
                                404 - Page Not Found
                            </div>
                        } />
                    </Routes>

                </div>
            </Router>

            <ToastContainer position="top-right" theme="dark" />
        </ThemeProvider>
    );
}

export default App;