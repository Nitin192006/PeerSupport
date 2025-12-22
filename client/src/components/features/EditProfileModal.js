import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import api from '../../services/api';

const EditProfileModal = ({ user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        password: '',
        avatar: user.avatar,
        equippedFrame: user.equippedFrame || "" // Handle empty frame
    });

    const [activeTab, setActiveTab] = useState('AVATAR'); // 'AVATAR' or 'FRAME'
    const [availableAvatars, setAvailableAvatars] = useState([]);
    const [availableFrames, setAvailableFrames] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch Cloud Assets (Avatars & Frames)
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                // Fetch Avatars
                const resAvatars = await api.get('/products?type=AVATAR_PACK');
                if (resAvatars.data) {
                    const allAvatars = resAvatars.data.reduce((acc, pack) => {
                        return pack.assets.length > 0 ? [...acc, ...pack.assets] : [...acc, pack.thumbnailUrl];
                    }, []);
                    setAvailableAvatars(allAvatars);
                }

                // Fetch Frames
                const resFrames = await api.get('/products?type=PROFILE_FRAME');
                setAvailableFrames(resFrames.data);

            } catch (error) {
                console.error("Failed to load assets", error);
            }
        };
        fetchAssets();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.updateProfile(formData);
            toast.success("Profile Updated!");
            onSuccess();
            onClose();
        } catch (error) {
            const msg = error.response?.data?.message || "Update failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Check if user owns the frame
    const isFrameOwned = (frameId) => {
        // Allow unequip (empty frame)
        if (!frameId) return true;
        return user.inventory?.frames?.includes(frameId);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-skin-panel rounded-theme-panel shadow-2xl p-8 max-w-md w-full border border-white/10 relative animate-float">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-skin-text opacity-50 hover:opacity-100 transition"
                >
                    <i className="fa-solid fa-times text-xl"></i>
                </button>

                <h2 className="text-2xl font-bold font-main text-skin-text mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* LIVE PREVIEW AREA */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24">
                            {/* The Avatar */}
                            <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
                                <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                            </div>

                            {/* The Frame Overlay */}
                            {formData.equippedFrame && (
                                <img
                                    src={formData.equippedFrame}
                                    alt="Frame"
                                    className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] object-contain pointer-events-none z-10"
                                />
                            )}
                        </div>
                        <p className="text-xs text-skin-text opacity-50 mt-2">Live Preview</p>
                    </div>

                    {/* TABS */}
                    <div className="flex border-b border-white/10">
                        <button
                            type="button"
                            onClick={() => setActiveTab('AVATAR')}
                            className={`flex-1 pb-2 text-sm font-bold transition ${activeTab === 'AVATAR' ? 'text-skin-primary border-b-2 border-skin-primary' : 'text-skin-text opacity-50'}`}
                        >
                            Avatars
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('FRAME')}
                            className={`flex-1 pb-2 text-sm font-bold transition ${activeTab === 'FRAME' ? 'text-skin-primary border-b-2 border-skin-primary' : 'text-skin-text opacity-50'}`}
                        >
                            Frames
                        </button>
                    </div>

                    {/* SELECTION GRID */}
                    <div className="h-40 overflow-y-auto bg-black/20 p-2 rounded-lg border border-white/10">

                        {/* AVATAR GRID */}
                        {activeTab === 'AVATAR' && (
                            <div className="grid grid-cols-4 gap-2">
                                {availableAvatars.map((url, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setFormData({ ...formData, avatar: url })}
                                        className={`aspect-square rounded-full overflow-hidden cursor-pointer border-2 transition ${formData.avatar === url ? 'border-skin-primary scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={url} alt="Av" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* FRAME GRID */}
                        {activeTab === 'FRAME' && (
                            <div className="grid grid-cols-3 gap-3">
                                {/* Unequip Option */}
                                <div
                                    onClick={() => setFormData({ ...formData, equippedFrame: "" })}
                                    className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer transition bg-white/5 ${formData.equippedFrame === "" ? 'border-skin-primary' : 'border-transparent opacity-70'
                                        }`}
                                >
                                    <span className="text-xs text-skin-text">None</span>
                                </div>

                                {/* Frame Products */}
                                {availableFrames.map((frame) => {
                                    const owned = isFrameOwned(frame._id);
                                    const frameUrl = frame.assets[0] || frame.thumbnailUrl;

                                    return (
                                        <div
                                            key={frame._id}
                                            onClick={() => owned && setFormData({ ...formData, equippedFrame: frameUrl })}
                                            className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer transition relative bg-white/5 ${formData.equippedFrame === frameUrl ? 'border-skin-primary' : 'border-transparent'
                                                } ${!owned ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
                                        >
                                            <img src={frameUrl} alt={frame.name} className="w-full h-full object-contain" />
                                            {!owned && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                                    <i className="fa-solid fa-lock text-white"></i>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* TEXT FIELDS */}
                    <div className="space-y-3">
                        <input
                            type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-skin-text focus:border-skin-primary outline-none transition text-sm"
                        />
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-skin-text focus:border-skin-primary outline-none transition text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-skin-btn rounded-theme-btn text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Profile"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;