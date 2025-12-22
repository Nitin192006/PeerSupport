import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import listenerService from '../services/listenerService';
import ListenerGrid from '../components/features/ListenerGrid';
import BecomeListenerModal from '../components/features/BecomeListenerModal';
// Import the new Avatar Component
import UserAvatar from '../components/common/UserAvatar';

const TAGS = ['Anxiety', 'Depression', 'Relationships', 'Career', 'LGBTQ+', 'Venting', 'School'];

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showListenerModal, setShowListenerModal] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [viewRole, setViewRole] = useState('talker');

    const [activeFilter, setActiveFilter] = useState(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
            if (currentUser.roles?.isListener) {
                setViewRole('listener');
                setIsOnline(false);
            } else {
                setViewRole('talker');
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleToggleOnline = async () => {
        try {
            const res = await listenerService.toggleStatus();
            setIsOnline(res.isOnline);
            toast.success(res.isOnline ? "You are now ONLINE" : "You are hidden (Offline)");
        } catch (error) {
            toast.error("Failed to toggle status");
        }
    };

    const handleSwitchRole = async (targetRole) => {
        if (targetRole === 'talker' && isOnline) {
            await handleToggleOnline();
            toast.info("Went offline to switch to Talker mode");
        }
        setViewRole(targetRole);
    };

    const onListenerActivated = () => {
        const updatedUser = { ...user, roles: { ...user.roles, isListener: true } };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setViewRole('listener');
    };

    if (!user) return null;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto" onClick={() => setShowFilterMenu(false)}>

            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-main font-bold text-skin-text mb-1">
                        Dashboard
                    </h1>
                    <p className="text-skin-text opacity-70">
                        Welcome back, <span className="font-bold text-white">{user.username}</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/settings" className="w-10 h-10 flex items-center justify-center rounded-theme-btn border border-white/20 text-skin-text hover:bg-white/10 transition group">
                        <i className="fa-solid fa-gear text-lg group-hover:rotate-90 transition duration-500"></i>
                    </Link>
                    <button onClick={handleLogout} className="px-6 py-2 rounded-theme-btn border border-white/20 text-skin-text hover:bg-white/10 transition font-bold">
                        Logout
                    </button>

                    {/* UPDATED AVATAR COMPONENT (With Frame Support) */}
                    <div className="cursor-pointer hover:scale-105 transition">
                        <UserAvatar
                            avatar={user.avatar}
                            frame={user.equippedFrame}
                            size="w-12 h-12"
                        />
                    </div>
                </div>
            </header>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link to="/wallet" className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-skin-primary transition block">
                    <div className="relative z-10">
                        <h3 className="text-skin-text opacity-70 text-sm font-bold uppercase tracking-wider mb-2">My Wallet</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">{user.wallet?.balance || 0}</span>
                            <span className="text-sm font-bold text-skin-active">Coins</span>
                        </div>
                        <p className="text-xs text-white/50 mt-2">Tap to view Ledger</p>
                    </div>
                    <i className="fa-solid fa-coins absolute -right-4 -bottom-4 text-8xl opacity-5 rotate-12 group-hover:scale-110 transition duration-500 text-skin-accent"></i>
                </Link>

                <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <h3 className="text-skin-text opacity-70 text-sm font-bold uppercase tracking-wider mb-2">Current Role</h3>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-skin-text capitalize">
                                {viewRole === 'listener' ? (isOnline ? "Listener (Online)" : "Listener (Offline)") : "Talker"}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4">
                        {viewRole === 'listener' ? (
                            <div className="space-y-2">
                                <button onClick={handleToggleOnline} className={`w-full py-2 rounded-theme-btn font-bold transition text-sm flex items-center justify-center gap-2 ${isOnline ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30' : 'bg-white/5 text-skin-text border border-white/10 hover:bg-white/10'}`}>
                                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                                    {isOnline ? "Go Offline" : "Go Online"}
                                </button>
                                <button onClick={() => handleSwitchRole('talker')} className="w-full py-2 text-xs font-bold text-skin-muted hover:text-white transition underline">Switch to Talker View</button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {user.roles?.isListener ? (
                                    <button onClick={() => handleSwitchRole('listener')} className="w-full py-2 bg-skin-btn rounded-theme-btn text-white font-bold text-sm shadow-lg hover:brightness-110 transition">Switch to Listener Mode</button>
                                ) : (
                                    <button onClick={() => setShowListenerModal(true)} className="w-full py-2 bg-skin-btn rounded-theme-btn text-white font-bold text-sm shadow-lg hover:brightness-110 transition">Become a Listener</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <Link to="/store" className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-skin-primary transition block">
                    <div className="flex justify-between items-start">
                        <h3 className="text-skin-text opacity-70 text-sm font-bold uppercase tracking-wider mb-2">Marketplace</h3>
                        <span className="bg-skin-btn text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-skin-muted"><i className="fa-solid fa-store"></i></div>
                        <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xs opacity-50 font-bold">+</div>
                    </div>
                    <p className="text-xs text-skin-accent mt-3 font-bold group-hover:underline">Visit Store →</p>
                </Link>
            </div>

            {/* LISTENER GRID */}
            {viewRole === 'talker' ? (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-skin-text font-main">Find a Listener</h2>

                        {/* FILTER DROPDOWN */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowFilterMenu(!showFilterMenu); }}
                                className={`text-sm px-4 py-2 rounded-theme-btn border transition flex items-center gap-2 ${activeFilter
                                        ? 'bg-skin-primary text-white border-skin-primary'
                                        : 'bg-skin-panel border-white/10 text-skin-text hover:border-skin-primary'
                                    }`}
                            >
                                {activeFilter ? `#${activeFilter}` : "Filter"} <i className="fa-solid fa-filter"></i>
                                {activeFilter && (
                                    <i
                                        className="fa-solid fa-times ml-2 opacity-70 hover:opacity-100"
                                        onClick={(e) => { e.stopPropagation(); setActiveFilter(null); }}
                                    ></i>
                                )}
                            </button>

                            {showFilterMenu && (
                                <div className="absolute right-0 top-12 bg-skin-panel border border-white/10 rounded-theme-panel shadow-2xl p-2 w-48 z-20 animate-float">
                                    {TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => { setActiveFilter(tag); setShowFilterMenu(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-skin-text hover:bg-white/10 rounded-lg transition"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pass Active Filter to Grid */}
                    <ListenerGrid filterTag={activeFilter} />
                </div>
            ) : (
                <div className="mt-8 bg-skin-panel rounded-theme-panel p-8 text-center border border-white/10">
                    <h2 className="text-xl font-bold text-skin-text mb-2">Listener Dashboard</h2>
                    <p className="text-skin-muted opacity-70">Waiting for incoming requests...</p>
                    <div className="mt-4 flex justify-center">
                        <div className="w-16 h-16 border-4 border-skin-primary border-t-transparent rounded-full animate-spin opacity-50"></div>
                    </div>
                </div>
            )}

            {showListenerModal && (
                <BecomeListenerModal onClose={() => setShowListenerModal(false)} onSuccess={onListenerActivated} />
            )}
        </div>
    );
};

export default Dashboard;