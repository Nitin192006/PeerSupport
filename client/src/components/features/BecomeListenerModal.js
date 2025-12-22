import React, { useState } from 'react';
import { toast } from 'react-toastify';
import listenerService from '../../services/listenerService';

const AVAILABLE_TAGS = [
    'Anxiety', 'Depression', 'Relationships', 'Career',
    'LGBTQ+', 'Venting', 'School'
];

const BecomeListenerModal = ({ onClose, onSuccess }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length >= 3) {
                toast.warning("Max 3 tags allowed.");
                return;
            }
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async () => {
        if (selectedTags.length === 0) {
            toast.error("Please select at least one topic.");
            return;
        }

        setLoading(true);
        try {
            await listenerService.updateProfile({ tags: selectedTags });
            toast.success("Profile Activated! You are now a Listener.");
            onSuccess(); // Triggers reload/update in parent
            onClose();
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to create profile";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-skin-panel rounded-theme-panel shadow-2xl p-8 max-w-md w-full border border-white/10 relative animate-float">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-skin-text opacity-50 hover:opacity-100 transition"
                >
                    <i className="fa-solid fa-times text-xl"></i>
                </button>

                <h2 className="text-2xl font-bold font-main text-skin-text mb-2">Become a Listener</h2>
                <p className="text-sm text-skin-text opacity-70 mb-6">
                    Select topics you are comfortable listening to. This helps us match you with the right people.
                </p>

                {/* Tag Grid */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {AVAILABLE_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-bold border transition ${selectedTags.includes(tag)
                                    ? 'bg-skin-primary text-white border-skin-primary'
                                    : 'bg-transparent text-skin-text border-white/20 hover:border-white/50'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-skin-btn rounded-theme-btn text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                    {loading ? "Activating..." : "Start Listening"}
                </button>

            </div>
        </div>
    );
};

export default BecomeListenerModal;