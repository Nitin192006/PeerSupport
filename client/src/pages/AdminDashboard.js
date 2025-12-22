import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import authService from '../services/authService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminWallet, setAdminWallet] = useState(null);

    // Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        type: 'STICKER_PACK', // Default selection
        price: 500,
    });
    const [assetFile, setAssetFile] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const user = authService.getCurrentUser();
            // Security Check: If not admin, kick them out
            if (!user || !user.roles?.isAdmin) {
                toast.error("Unauthorized Access");
                navigate('/');
                return;
            }

            try {
                // Fetch Treasury Balance
                const res = await api.get('/wallet');
                setAdminWallet(res.data);
            } catch (error) {
                console.error("Failed to load admin data");
            }
        };
        checkAdmin();
    }, [navigate]);

    const handleFileChange = (e) => {
        setAssetFile(e.target.files[0]);
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        if (!assetFile) {
            toast.error("Please upload the product asset file.");
            return;
        }

        const formData = new FormData();
        formData.append('image', assetFile);
        formData.append('name', newProduct.name);
        formData.append('type', newProduct.type);
        formData.append('price', newProduct.price);

        try {
            await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success("New Asset Uploaded to Cloud & Store!");
            // Reset form
            setNewProduct({ name: '', type: 'STICKER_PACK', price: 500 });
            setAssetFile(null);
            document.getElementById('fileInput').value = "";

        } catch (error) {
            const msg = error.response?.data?.message || "Failed to create product";
            toast.error(msg);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen bg-skin-base text-skin-text">

            <header className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-main font-bold text-skin-accent">
                    <i className="fa-solid fa-shield-halved mr-3"></i>
                    Admin Command
                </h1>
                <button onClick={() => navigate('/')} className="px-4 py-2 border border-white/20 rounded-theme-btn hover:bg-white/10 text-skin-text transition">
                    Exit to App
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* REVENUE CARD */}
                <div className="bg-skin-panel rounded-theme-panel p-8 border border-skin-primary/30 shadow-theme-panel">
                    <h2 className="text-xl font-bold text-skin-primary mb-4 uppercase tracking-widest">Platform Revenue</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-skin-text">{adminWallet?.balance || 0}</span>
                        <span className="text-xl font-bold text-skin-primary">Coins</span>
                    </div>
                    <p className="text-sm opacity-50 mt-4 text-skin-muted">
                        Accumulated from 30% Commissions & Store Sales.
                    </p>
                    <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10 h-48 overflow-y-auto">
                        <h3 className="text-xs font-bold text-skin-muted uppercase mb-2">Recent Income</h3>
                        {adminWallet?.history?.map(tx => (
                            <div key={tx._id} className="flex justify-between text-xs py-2 border-b border-white/5">
                                <span className="opacity-70 text-skin-text">{tx.description}</span>
                                <span className="text-skin-accent font-mono">+{tx.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CMS FORM */}
                <div className="bg-skin-panel rounded-theme-panel p-8 border border-white/10 shadow-theme-panel">
                    <h2 className="text-xl font-bold text-skin-text mb-4 uppercase tracking-widest">Store Manager</h2>
                    <form onSubmit={handleCreateProduct} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-skin-muted opacity-70">Item Name</label>
                            <input
                                type="text"
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-skin-text focus:border-skin-primary outline-none transition"
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                placeholder="e.g. Neon Avatar"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-skin-muted opacity-70">Price (Coins)</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-skin-text focus:border-skin-primary outline-none transition"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                    placeholder="0 for Free Assets"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-skin-muted opacity-70">Type</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-skin-text focus:border-skin-primary outline-none transition"
                                    value={newProduct.type}
                                    onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                                >
                                    <option value="STICKER_PACK">Sticker Pack</option>
                                    <option value="PROFILE_FRAME">Profile Frame</option>
                                    <option value="AVATAR_PACK">Avatar Pack</option>
                                    <option value="THEME">UI Theme</option>
                                </select>
                            </div>
                        </div>

                        {/* FILE UPLOAD INPUT */}
                        <div>
                            <label className="text-xs font-bold text-skin-muted opacity-70">Asset Upload (Image)</label>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-skin-text text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-skin-primary file:text-white hover:file:bg-skin-primary/80 cursor-pointer"
                                required
                            />
                            <p className="text-[10px] text-skin-muted opacity-50 mt-1">
                                File will be uploaded to Cloudinary.
                            </p>
                        </div>

                        <button className="w-full py-3 bg-skin-btn rounded-theme-btn text-white font-bold shadow-lg hover:brightness-110 transition">
                            Upload to Cloud & Publish
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;