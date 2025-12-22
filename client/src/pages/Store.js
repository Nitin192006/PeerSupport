import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import authService from '../services/authService';
import PaymentService from '../services/paymentService';

const COIN_PACKAGES = [
    { id: 'pack_small', name: 'Handful of Coins', coins: 100, price: 100, color: 'bg-blue-500' },
    { id: 'pack_medium', name: 'Bag of Coins', coins: 550, price: 500, color: 'bg-purple-500', bonus: '10%' },
    { id: 'pack_large', name: 'Chest of Coins', coins: 1200, price: 1000, color: 'bg-orange-500', bonus: '20%' },
    { id: 'pack_mega', name: 'Vault of Coins', coins: 3000, price: 2000, color: 'bg-yellow-500', bonus: '50%' },
];

const Store = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('STICKER_PACK'); // Default Tab
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (!currentUser) {
                    navigate('/login');
                    return;
                }

                // Fetch latest wallet/inventory data
                const walletRes = await api.get('/wallet');

                // We merge the wallet response with the current user to get the latest inventory arrays
                // Note: Ensure /wallet endpoint returns inventory or fetch from /auth/me if available
                // For MVP, we rely on the walletRes or a fresh user fetch. 
                // Let's assume we need to refresh the user to get the updated inventory.
                // A better approach in a real app is a dedicated /users/me endpoint.
                // Here we will just use the local user + wallet update, 
                // BUT we need to make sure 'isOwned' has the latest data after purchase.
                setUser({ ...currentUser, wallet: walletRes.data });

                const productRes = await api.get('/products');
                setProducts(productRes.data);
            } catch (error) {
                console.error("Store Load Error", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [navigate]);

    const handleBuyItem = async (productId, price, productName) => {
        if (!window.confirm(`Buy ${productName} for ${price} coins?`)) return;

        try {
            const res = await api.post(`/products/purchase/${productId}`);
            toast.success(res.data.message);

            // Update User State with new Balance AND Inventory
            setUser(prev => ({
                ...prev,
                wallet: { ...prev.wallet, balance: res.data.newBalance },
                inventory: res.data.inventory // Critical: Update inventory to reflect purchase immediately
            }));

            // Update local storage to persist the new inventory state across reloads
            const currentUser = authService.getCurrentUser();
            currentUser.inventory = res.data.inventory;
            localStorage.setItem('user', JSON.stringify(currentUser));

        } catch (error) {
            const msg = error.response?.data?.message || "Purchase failed";
            toast.error(msg);
        }
    };

    const handleBuyCoins = (packageId) => {
        PaymentService.buyCoins(packageId);
    };

    // Check if the user owns the product
    const isOwned = (product) => {
        if (!user || !user.inventory) return false;

        if (product.type === 'STICKER_PACK') {
            return user.inventory.stickerPacks?.includes(product._id);
        }
        if (product.type === 'PROFILE_FRAME') {
            return user.inventory.frames?.includes(product._id);
        }
        // NEW: Check Theme Inventory
        if (product.type === 'THEME') {
            return user.inventory.themes?.includes(product._id);
        }
        return false;
    };

    if (loading) return <div className="p-10 text-center text-skin-text">Loading Store...</div>;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">

            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="text-skin-text opacity-50 hover:opacity-100">
                        <i className="fa-solid fa-arrow-left text-2xl"></i>
                    </button>
                    <h1 className="text-4xl font-main font-bold text-skin-text">Marketplace</h1>
                </div>

                <div className="bg-skin-panel px-6 py-2 rounded-theme-btn border border-white/20 flex items-center gap-2">
                    <span className="text-skin-muted text-sm font-bold uppercase">Balance:</span>
                    <span className="text-2xl font-bold text-skin-accent">{user?.wallet?.balance || 0}</span>
                    <i className="fa-solid fa-coins text-skin-accent"></i>
                </div>
            </header>

            {/* TABS */}
            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                <button
                    onClick={() => setFilter('STICKER_PACK')}
                    className={`px-4 py-2 rounded-theme-btn font-bold transition whitespace-nowrap ${filter === 'STICKER_PACK' ? 'bg-skin-primary text-white' : 'text-skin-text hover:bg-white/10'}`}
                >
                    Stickers
                </button>
                {/* NEW THEME TAB */}
                <button
                    onClick={() => setFilter('THEME')}
                    className={`px-4 py-2 rounded-theme-btn font-bold transition whitespace-nowrap ${filter === 'THEME' ? 'bg-skin-primary text-white' : 'text-skin-text hover:bg-white/10'}`}
                >
                    UI Themes
                </button>
                <button
                    onClick={() => setFilter('PROFILE_FRAME')}
                    className={`px-4 py-2 rounded-theme-btn font-bold transition whitespace-nowrap ${filter === 'PROFILE_FRAME' ? 'bg-skin-primary text-white' : 'text-skin-text hover:bg-white/10'}`}
                >
                    Frames
                </button>
                <button
                    onClick={() => setFilter('COINS')}
                    className={`px-4 py-2 rounded-theme-btn font-bold transition whitespace-nowrap flex items-center gap-2 ${filter === 'COINS' ? 'bg-yellow-500 text-black' : 'text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/10'}`}
                >
                    <i className="fa-solid fa-plus"></i> Buy Coins
                </button>
            </div>

            {/* CONTENT AREA */}
            {filter === 'COINS' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {COIN_PACKAGES.map(pack => (
                        <div key={pack.id} className="bg-skin-panel rounded-theme-panel border border-white/10 overflow-hidden hover:border-yellow-500 transition duration-300 flex flex-col relative group">
                            {pack.bonus && (
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                    {pack.bonus} BONUS
                                </div>
                            )}
                            <div className={`h-32 ${pack.color} p-4 flex items-center justify-center relative bg-opacity-20`}>
                                <i className="fa-solid fa-coins text-6xl text-white drop-shadow-lg group-hover:scale-110 transition"></i>
                            </div>
                            <div className="p-6 flex-1 flex flex-col text-center">
                                <h3 className="text-xl font-bold text-skin-text mb-1">{pack.name}</h3>
                                <p className="text-3xl font-bold text-yellow-400 mb-4">{pack.coins} <span className="text-sm text-skin-muted">Coins</span></p>

                                <button
                                    onClick={() => handleBuyCoins(pack.id)}
                                    className="w-full py-3 bg-white text-black font-bold rounded-theme-btn hover:bg-yellow-400 transition mt-auto"
                                >
                                    Buy for ₹{pack.price}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.filter(p => p.type === filter).length === 0 && (
                        <div className="col-span-full text-center text-skin-muted opacity-50 py-10">
                            No items found in this category.
                        </div>
                    )}

                    {products.filter(p => p.type === filter).map(product => {
                        const owned = isOwned(product);
                        return (
                            <div key={product._id} className="bg-skin-panel rounded-theme-panel border border-white/10 overflow-hidden hover:border-skin-primary transition duration-300 flex flex-col">
                                <div className="h-40 bg-black/20 p-4 flex items-center justify-center relative group">
                                    <img src={product.thumbnailUrl} alt={product.name} className="h-full object-contain drop-shadow-lg transition-transform group-hover:scale-105" />
                                    {owned && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-green-400 font-bold border-2 border-green-400 px-4 py-1 rounded-full transform -rotate-12">OWNED</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-skin-text">{product.name}</h3>
                                    <p className="text-xs text-skin-muted mb-4">{product.description || "Unlock this asset."}</p>
                                    <div className="mt-auto flex justify-between items-center">
                                        <div className="text-skin-accent font-bold">{product.price} <i className="fa-solid fa-coins text-xs"></i></div>
                                        <button
                                            onClick={() => handleBuyItem(product._id, product.price, product.name)}
                                            disabled={owned || user.wallet.balance < product.price}
                                            className={`px-4 py-2 rounded-theme-btn text-sm font-bold transition ${owned ? 'bg-white/10 text-white/50 cursor-not-allowed' : user.wallet.balance < product.price ? 'bg-red-500/20 text-red-400 cursor-not-allowed' : 'bg-skin-btn text-white hover:brightness-110 shadow-lg'}`}
                                        >
                                            {owned ? 'Installed' : user.wallet.balance < product.price ? 'Too Expensive' : 'Buy'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Store;