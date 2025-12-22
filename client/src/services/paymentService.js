import api from './api';
import { toast } from 'react-toastify';

// Helper to load the Razorpay SDK dynamically
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PaymentService = {
    buyCoins: async (packageId) => {
        // 1. Load SDK
        const res = await loadRazorpayScript();
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            // 2. Create Order on Backend
            const { data: orderData } = await api.post('/payment/create-order', { packageId });

            // 3. Configure Razorpay Options
            const options = {
                key: orderData.keyId, // Public Key from backend
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Peer Support",
                description: `Purchase ${orderData.coins} Coins`,
                image: "/assets/ui/coin_logo.png", // Add a logo later if you want
                order_id: orderData.orderId,

                // 4. Handle Success
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            packageId: packageId
                        });

                        if (verifyRes.data.success) {
                            toast.success(`Payment Successful! Balance updated.`);
                            // Reload page or trigger global state update to show new balance
                            window.location.reload();
                        }
                    } catch (err) {
                        toast.error("Payment Verification Failed. Contact Support.");
                    }
                },
                theme: {
                    color: "#6366f1", // Matches your Primary Color
                },
            };

            // 5. Open Modal
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Could not initiate payment");
        }
    }
};

export default PaymentService;