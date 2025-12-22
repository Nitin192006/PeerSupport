import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import { defaultTheme } from '../theme/default';
import EditProfileModal from '../components/features/EditProfileModal';

const Settings = () => {
    const navigate = useNavigate();
    const { applyTheme } = useContext(ThemeContext);
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // NEW: Store themes fetched from the server
    const [myThemes, setMyThemes] = useState([]);

    // Real State for Toggles
    const [privacySettings, setPrivacySettings] = useState({
        autoDelete: false,
        allowVoice: true,
        anonymousMode: true
    });

    useEffect(() => {
        loadUser();
        fetchThemes();
    }, [navigate]);

    const loadUser = () => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
            if (currentUser.settings) {
                setPrivacySettings(currentUser.settings);
            }
        }
    };

    // NEW: Fetch themes from the backend (Cloud/DB)
    const fetchThemes = async () => {
        try {
            // We fetch all products of type THEME.
            const res = await api.get('/products?type=THEME');
            setMyThemes(res.data);
        } catch (error) {
            console.error("Failed to load themes", error);
        }
    };

    // NEW: Apply the Local Default Theme
    const handleApplyDefault = () => {
        applyTheme(defaultTheme);
        toast.success("Applied: Default Standard");
    };

    // NEW: Handle applying a theme from the Database
    const handleThemeChange = (themeProduct) => {
        // Map the Product Assets (URLs from Cloudinary) to CSS Variables
        // Order: Asset[0]=BG, Asset[1]=Panel, Asset[2]=Button
        const themeData = {
            id: themeProduct._id,
            "--app-bg": `url('${themeProduct.assets[0] || themeProduct.thumbnailUrl}')`,
            "--panel-bg": themeProduct.assets[1] ? `url('${themeProduct.assets[1]}')` : "rgba(30, 41, 59, 0.9)",
            "--panel-border": "1px solid rgba(255,255,255,0.1)",
            "--panel-radius": "12px",
            "--btn-primary-bg": themeProduct.assets[2] ? `url('${themeProduct.assets[2]}')` : "linear-gradient(to right, #6366f1, #8b5cf6)",
            "--btn-radius": "8px",
            "--icon-active-color": "#ffffff",
            "--font-main": "system-ui, sans-serif",
            "--text-color": "#ffffff"
        };

        applyTheme(themeData);
        toast.success(`Applied: ${themeProduct.name}`);
    };

    const toggleSetting = async (key) => {
        const newSettings = { ...privacySettings, [key]: !privacySettings[key] };
        setPrivacySettings(newSettings);

        try {
            await authService.updateSettings(newSettings);
        } catch (error) {
            toast.error("Failed to save setting");
            setPrivacySettings(privacySettings);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure? This cannot be undone. All coins and history will be lost.")) {
            try {
                await authService.deleteAccount();
                toast.success("Account deleted.");
                navigate('/login');
            } catch (error) {
                toast.error("Failed to delete account");
            }
        }
    };

    const handleProfileUpdateSuccess = () => {
        loadUser();
    };

    if (!user) return null;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="text-skin-text opacity-50 hover:opacity-100 transition">
                    <i className="fa-solid fa-arrow-left text-2xl"></i>
                </button>
                <h1 className="text-3xl font-main font-bold text-skin-text">Settings</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* COLUMN 1: IDENTITY & APPEARANCE */}
                <div className="space-y-6">
                    {/* Identity Card */}
                    <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-white/10">
                        <h2 className="text-sm font-bold text-skin-text opacity-70 uppercase tracking-wider mb-4">Identity</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden border-2 border-white/20">
                                <img src={user.avatar || "/assets/avatars/default.png"} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-skin-text">{user.username}</h3>
                                <p className="text-xs text-skin-text opacity-60">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowEditModal(true)} className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 text-skin-text text-sm font-bold rounded-theme-btn border border-white/10 transition">
                            Edit Profile
                        </button>
                    </div>

                    {/* DYNAMIC THEME SWITCHER */}
                    <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-white/10">
                        <h2 className="text-sm font-bold text-skin-text opacity-70 uppercase tracking-wider mb-4">Appearance</h2>

                        <div className="grid grid-cols-3 gap-3">
                            {/* Default Button (Local) */}
                            <button
                                onClick={handleApplyDefault}
                                className="aspect-square rounded-xl border border-white/20 hover:border-skin-primary transition flex flex-col items-center justify-center gap-2 bg-[#0f172a]"
                            >
                                <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
                                <span className="text-[10px] font-bold text-white">Default</span>
                            </button>

                            {/* Render Fetched Themes (Cloud) */}
                            {myThemes.map(theme => (
                                <button
                                    key={theme._id}
                                    onClick={() => handleThemeChange(theme)}
                                    className="aspect-square rounded-xl border border-white/20 hover:border-skin-primary transition flex flex-col items-center justify-center gap-2 relative overflow-hidden group bg-black/20"
                                >
                                    {/* Thumbnail Preview */}
                                    <img src={theme.thumbnailUrl} alt={theme.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition" />
                                    <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-md bg-black/50 px-1 rounded">{theme.name}</span>
                                </button>
                            ))}
                        </div>

                        <p className="text-xs text-center mt-4 text-skin-text opacity-40">
                            <Link to="/store" className="hover:underline hover:text-skin-primary">Buy more themes in Store</Link>
                        </p>
                    </div>
                </div>

                {/* COLUMN 2: PRIVACY & SAFETY (UNCHANGED LOGIC) */}
                <div className="space-y-6">
                    <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-white/10">
                        <h2 className="text-sm font-bold text-skin-text opacity-70 uppercase tracking-wider mb-4">Privacy & Safety</h2>
                        <div className="space-y-4">
                            {['anonymousMode', 'autoDelete', 'allowVoice'].map(key => (
                                <div key={key} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-skin-text text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting(key)}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${privacySettings[key] ? 'bg-skin-primary' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${privacySettings[key] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* About App */}
                    <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-white/10">
                        <h2 className="text-sm font-bold text-skin-text opacity-70 uppercase tracking-wider mb-4">About App</h2>
                        <div className="text-xs text-skin-text opacity-80 space-y-2">
                            <p>Version: 1.0.0 (Beta)</p>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10 mt-2">
                                <p className="font-bold text-skin-active mb-1">Platform Commissions</p>
                                <p>To support the community, a <span className="font-bold text-white">30% fee</span> is applied to all Tips and paid Booking transactions.</p>
                            </div>
                            <Link to="/terms" className="block text-skin-primary hover:underline mt-2 font-bold">
                                Read Full Terms of Service
                            </Link>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-red-500/30">
                        <h2 className="text-sm font-bold text-red-400 opacity-90 uppercase tracking-wider mb-4">Danger Zone</h2>
                        <button onClick={handleDeleteAccount} className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-theme-btn border border-red-500/50 transition">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSuccess={handleProfileUpdateSuccess} />
            )}
        </div>
    );
};

export default Settings;