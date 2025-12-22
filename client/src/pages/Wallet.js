import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Wallet = () => {
    const navigate = useNavigate();
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const res = await api.get('/wallet');
                setWalletData(res.data);
            } catch (error) {
                console.error("Failed to load wallet");
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, []);

    if (loading) return <div className="p-10 text-center text-skin-text">Loading Ledger...</div>;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen">

            {/* HEADER */}
            <header className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="text-skin-text opacity-50 hover:opacity-100 transition">
                    <i className="fa-solid fa-arrow-left text-2xl"></i>
                </button>
                <h1 className="text-3xl font-main font-bold text-skin-text">My Wallet</h1>
            </header>

            {/* BALANCE CARD */}
            <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-8 border border-white/10 mb-8 relative overflow-hidden">
                <div className="relative z-10 text-center">
                    <p className="text-skin-text opacity-70 uppercase tracking-widest text-sm font-bold mb-2">Total Balance</p>
                    <div className="text-6xl font-bold text-white flex justify-center items-baseline gap-2">
                        {walletData?.balance || 0}
                        <span className="text-2xl text-skin-active">Coins</span>
                    </div>

                    {/* ACTION BUTTON: Redirect to Store (No Free Bonus) */}
                    <button
                        onClick={() => navigate('/store')}
                        className="mt-6 px-8 py-3 bg-skin-btn rounded-theme-btn text-white font-bold shadow-lg hover:brightness-110 transition flex items-center gap-2 mx-auto"
                    >
                        <i className="fa-solid fa-plus-circle"></i> Add Funds
                    </button>
                    <p className="text-xs text-skin-muted mt-2 opacity-60">Buy coins instantly via Razorpay</p>
                </div>
                {/* Background Decor */}
                <i className="fa-solid fa-wallet absolute -right-10 -bottom-10 text-9xl opacity-5 rotate-12"></i>
            </div>

            {/* TRANSACTION HISTORY */}
            <h2 className="text-xl font-bold text-skin-text mb-4 pl-2 border-l-4 border-skin-primary">Transaction History</h2>

            <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel border border-white/10 overflow-hidden">
                {walletData?.history?.length === 0 ? (
                    <div className="p-8 text-center text-skin-text opacity-50">No transactions yet.</div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {walletData.history.map((tx) => (
                            <div key={tx._id} className="p-4 flex items-center justify-between hover:bg-white/5 transition">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 ${tx.type === 'CREDIT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        <i className={`fa-solid ${tx.type === 'CREDIT' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                                    </div>
                                    <div>
                                        <p className="text-skin-text font-bold text-sm">{tx.description}</p>
                                        <p className="text-xs text-skin-text opacity-50">
                                            {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className={`font-bold font-mono ${tx.type === 'CREDIT' ? 'text-green-400' : 'text-skin-text'
                                    }`}>
                                    {tx.type === 'CREDIT' ? '+' : ''}{tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Wallet;