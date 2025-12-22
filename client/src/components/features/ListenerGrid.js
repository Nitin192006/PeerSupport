import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import UserAvatar from '../common/UserAvatar'; // Import the Frame-Aware Avatar

const ListenerGrid = ({ filterTag }) => {
    const [listeners, setListeners] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListeners = async () => {
            setLoading(true);
            try {
                const endpoint = filterTag
                    ? `/listeners?tag=${filterTag}`
                    : '/listeners';

                const { data } = await api.get(endpoint);
                setListeners(data);
            } catch (error) {
                console.error("Failed to load listeners");
            } finally {
                setLoading(false);
            }
        };

        fetchListeners();
    }, [filterTag]);

    const handleConnect = async (listenerId, isPaid = false) => {
        try {
            const res = await api.post('/chat/start', { listenerId, isPaid });
            navigate(`/chat/${res.data._id}`);
        } catch (error) {
            const message = error.response?.data?.message || "Failed to start chat";
            toast.error(message);
        }
    };

    if (loading) return <div className="text-center p-10 opacity-50 text-skin-text">Scanning frequencies...</div>;

    if (listeners.length === 0) {
        return (
            <div className="bg-skin-panel p-8 rounded-theme-panel text-center border border-white/10">
                <i className="fa-solid fa-satellite-dish text-4xl text-skin-muted mb-4"></i>
                <h3 className="text-xl font-bold text-skin-text">No Listeners Found</h3>
                <p className="text-sm opacity-60 mt-2">
                    {filterTag ? `No one is listening for #${filterTag} right now.` : "Try refreshing in a moment."}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listeners.map((profile) => (
                <div key={profile._id} className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-6 border border-white/10 hover:border-skin-primary transition duration-300 relative group">

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                        {profile.pricing?.isBookable && (
                            <span className="bg-skin-accent/20 text-skin-accent text-xs px-2 py-1 rounded-full border border-skin-accent/30 font-bold">
                                PRO
                            </span>
                        )}
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 animate-pulse">
                            LIVE
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        {/* UPDATED: Using UserAvatar to show Frame */}
                        <UserAvatar
                            avatar={profile.user?.avatar}
                            frame={profile.user?.equippedFrame}
                            size="w-16 h-16"
                        />

                        <div>
                            <h3 className="font-bold text-lg text-skin-text">{profile.user?.username}</h3>
                            <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                <i className="fa-solid fa-star"></i>
                                <span className="font-bold">{profile.rating?.average?.toFixed(1) || "New"}</span>
                                <span className="text-skin-muted">({profile.rating?.count || 0})</span>
                            </div>
                            <span className="text-xs text-skin-muted uppercase tracking-wider font-bold">
                                {profile.rank}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {profile.tags.map(tag => (
                            <span key={tag} className="text-xs bg-white/5 text-skin-text px-3 py-1 rounded-full border border-white/10">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleConnect(profile.user._id, false)}
                            className="flex-1 bg-skin-btn rounded-theme-btn text-white py-2 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition"
                        >
                            Chat Now
                        </button>

                        {profile.pricing?.isBookable && (
                            <button
                                onClick={() => handleConnect(profile.user._id, true)}
                                className="px-4 bg-skin-card border border-skin-primary text-skin-primary rounded-theme-btn font-bold hover:bg-skin-primary hover:text-white transition"
                                title="Book Session"
                            >
                                <i className="fa-solid fa-calendar-check"></i>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListenerGrid;