import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import authService from '../../services/authService';

const StickerDrawer = ({ onSelect, onClose }) => {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [ownedPackIds, setOwnedPackIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get Current User Inventory
                const user = authService.getCurrentUser();
                // In a real app, we might want to fetch the latest inventory from API to be safe
                // For MVP, we trust the localStorage or trigger a background refresh
                if (user && user.inventory) {
                    setOwnedPackIds(user.inventory.stickerPacks || []);
                }

                // 2. Fetch Packs from Store
                const res = await api.get('/products?type=STICKER_PACK');

                if (res.data && res.data.length > 0) {
                    setPacks(res.data);
                } else {
                    // Fallback if DB is empty
                    setPacks([]);
                }
            } catch (error) {
                console.error("Failed to load stickers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const isPackOwned = (packId) => {
        // "Default" pack is always free/owned if you have one hardcoded
        // Otherwise check inventory
        return ownedPackIds.includes(packId);
    };

    const handlePackClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="absolute bottom-20 left-4 right-4 md:left-auto md:w-96 bg-skin-panel border border-white/10 rounded-theme-panel shadow-2xl backdrop-blur-xl z-50 overflow-hidden flex flex-col h-72 animate-float">

            {/* Header / Tabs */}
            <div className="flex items-center bg-black/20 p-2 overflow-x-auto scrollbar-hide">
                <button onClick={onClose} className="p-2 text-skin-text opacity-50 hover:opacity-100 mr-2">
                    <i className="fa-solid fa-times"></i>
                </button>
                {packs.map((pack, index) => {
                    const owned = isPackOwned(pack._id);
                    return (
                        <button
                            key={pack._id}
                            onClick={() => handlePackClick(index)}
                            className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap transition ml-2 flex items-center gap-1 ${activeTab === index
                                    ? 'bg-skin-primary text-white'
                                    : 'text-skin-text hover:bg-white/10'
                                }`}
                        >
                            {pack.name}
                            {!owned && <i className="fa-solid fa-lock text-[10px] opacity-70"></i>}
                        </button>
                    );
                })}
            </div>

            {/* Sticker Grid */}
            <div className="flex-1 overflow-y-auto p-4 relative">
                {loading ? (
                    <div className="text-center text-xs opacity-50 mt-10">Loading assets...</div>
                ) : packs.length === 0 ? (
                    <div className="text-center text-xs opacity-50 mt-10">No sticker packs found.</div>
                ) : (
                    <>
                        {/* OWNERSHIP CHECK */}
                        {!isPackOwned(packs[activeTab]._id) ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 p-6 text-center backdrop-blur-sm">
                                <i className="fa-solid fa-lock text-4xl text-skin-muted mb-3"></i>
                                <h3 className="text-lg font-bold text-white mb-1">Pack Locked</h3>
                                <p className="text-xs text-skin-text opacity-70 mb-4">
                                    You need to buy this pack to use these stickers.
                                </p>
                                <button
                                    onClick={() => navigate('/store')}
                                    className="px-6 py-2 bg-skin-primary text-white rounded-theme-btn font-bold text-sm shadow-lg hover:brightness-110 transition"
                                >
                                    Go to Store
                                </button>
                            </div>
                        ) : null}

                        {/* STICKERS */}
                        <div className={`grid grid-cols-4 gap-4 ${!isPackOwned(packs[activeTab]._id) ? 'opacity-20 pointer-events-none' : ''}`}>
                            {packs[activeTab]?.assets.map((url, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => onSelect(url)}
                                    className="aspect-square flex items-center justify-center cursor-pointer hover:scale-110 transition bg-white/5 rounded-lg p-2"
                                >
                                    <img src={url} alt="sticker" className="w-full h-full object-contain pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StickerDrawer;