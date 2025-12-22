import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const PRESET_AMOUNTS = [10, 50, 100, 500];

const TipModal = ({ recipientId, recipientName, onClose, onSuccess }) => {
    const [amount, setAmount] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleTip = async () => {
        setLoading(true);
        try {
            await api.post('/wallet/tip', {
                recipientId,
                amount
            });
            toast.success(`Sent ${amount} coins to ${recipientName}!`);
            onSuccess(amount); // Callback to update parent UI or send system message
            onClose();
        } catch (error) {
            const msg = error.response?.data?.message || "Tip failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-skin-panel rounded-theme-panel shadow-2xl p-6 max-w-sm w-full border border-white/10 relative animate-float">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-skin-text opacity-50 hover:opacity-100 transition"
                >
                    <i className="fa-solid fa-times"></i>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-skin-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 text-skin-accent border border-skin-accent/30">
                        <i className="fa-solid fa-gift text-3xl"></i>
                    </div>
                    <h2 className="text-xl font-bold font-main text-skin-text">Send a Tip</h2>
                    <p className="text-sm text-skin-text opacity-70">
                        Show appreciation to <span className="font-bold text-white">{recipientName}</span>
                    </p>
                </div>

                {/* Amount Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {PRESET_AMOUNTS.map((val) => (
                        <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className={`py-3 rounded-lg font-bold border transition flex flex-col items-center justify-center ${amount === val
                                    ? 'bg-skin-primary text-white border-skin-primary shadow-lg scale-105'
                                    : 'bg-white/5 text-skin-text border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <span className="text-lg">{val}</span>
                            <span className="text-[10px] uppercase opacity-70">Coins</span>
                        </button>
                    ))}
                </div>

                {/* Custom Amount (Optional UI expansion) */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-skin-text opacity-70 uppercase tracking-wider mb-1 block">Custom Amount</label>
                    <div className="flex bg-black/20 rounded-lg border border-white/10 overflow-hidden focus-within:border-skin-primary transition">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="flex-1 bg-transparent p-3 text-white font-bold outline-none"
                            min="1"
                        />
                        <div className="bg-white/5 px-4 flex items-center text-skin-text text-sm font-bold border-l border-white/10">
                            Coins
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleTip}
                    disabled={loading}
                    className="w-full py-3 bg-skin-accent rounded-theme-btn text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                    {loading ? "Sending..." : `Send ${amount} Coins`}
                </button>

                <p className="text-center text-[10px] text-skin-text opacity-40 mt-4">
                    Includes 30% platform fee contribution.
                </p>

            </div>
        </div>
    );
};

export default TipModal;