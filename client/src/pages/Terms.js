import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-skin-base text-skin-text p-8 flex justify-center">
            <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-8 max-w-2xl w-full border border-white/10 backdrop-blur-md">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-skin-text opacity-50 hover:opacity-100 transition flex items-center gap-2"
                >
                    <i className="fa-solid fa-arrow-left"></i> Back
                </button>

                <h1 className="text-3xl font-main font-bold mb-6">Terms of Service</h1>

                <div className="space-y-6 text-sm opacity-80 leading-relaxed font-body">

                    <section>
                        <h2 className="text-xl font-bold text-skin-primary mb-2">1. The Peer Support Economy</h2>
                        <p>
                            Our platform operates on a virtual currency system ("Coins"). These coins can be used to book sessions, send tips, or purchase digital assets in the store.
                        </p>
                    </section>

                    <section className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <h2 className="text-xl font-bold text-skin-accent mb-2">2. Platform Fees & Commissions</h2>
                        <p className="mb-2">
                            To maintain the servers, develop new features, and ensure safety, the platform charges a **Service Fee** on transactions.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                <strong>Tipping:</strong> A <span className="text-skin-accent font-bold">30% Platform Fee</span> is deducted from all tips sent. (e.g., If you send 100 Coins, the recipient receives 70 Coins).
                            </li>
                            <li>
                                <strong>Bookings:</strong> A <span className="text-skin-accent font-bold">30% Platform Fee</span> is deducted from paid booking sessions upon completion.
                            </li>
                            <li>
                                <strong>Store Purchases:</strong> 100% of the listed price goes to the platform.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-skin-primary mb-2">3. User Conduct</h2>
                        <p>
                            Users must respect the anonymity of others. Harassment, hate speech, or sharing personal contact information is strictly prohibited and may result in a ban and forfeiture of wallet balance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-skin-primary mb-2">4. Refunds</h2>
                        <p>
                            Refunds are processed automatically for booking sessions that end prematurely due to technical faults (under 5 minutes). Voluntary cancellations by the Talker during a session are not eligible for refunds.
                        </p>
                    </section>

                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs opacity-50">
                    Last Updated: December 2025
                </div>

            </div>
        </div>
    );
};

export default Terms;