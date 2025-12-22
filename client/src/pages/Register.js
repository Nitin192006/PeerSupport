import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    // New State to track if the checkbox is ticked
    const [agreed, setAgreed] = useState(false);

    const navigate = useNavigate();
    const { username, email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation: Block submission if terms aren't accepted
        if (!agreed) {
            toast.error("You must agree to the Terms of Service.");
            return;
        }

        try {
            // 2. Register Logic
            await authService.register({ username, email, password });
            toast.success('Account created! +100 Coins Bonus');
            navigate('/');
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            toast.error(message);
        }
    };

    return (
        <div className="flex items-center justify-center h-full w-full pt-20">
            <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-8 w-96 max-w-full border border-white/10 backdrop-blur-md">

                <h1 className="text-3xl font-main font-bold text-skin-text text-center mb-6">
                    Join Us
                </h1>
                <p className="text-center text-sm text-skin-text opacity-70 mb-6">
                    Create an anonymous identity.
                </p>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-skin-text opacity-80">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            placeholder="Pick a unique name"
                            className="p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-skin-text opacity-80">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Enter your email"
                            className="p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-skin-text opacity-80">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Create a password"
                            className="p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    {/* TERMS CHECKBOX (New Feature) */}
                    <div className="flex items-start gap-3 mt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1 w-4 h-4 cursor-pointer accent-skin-primary"
                        />
                        <label htmlFor="terms" className="text-xs text-skin-text opacity-80 cursor-pointer select-none leading-relaxed">
                            I agree to the <Link to="/terms" target="_blank" className="text-skin-accent font-bold hover:underline">Terms of Service</Link>, including the 30% platform fee on transactions.
                        </label>
                    </div>

                    {/* BUTTON (Disabled state added) */}
                    <button
                        type="submit"
                        disabled={!agreed}
                        className={`mt-2 rounded-theme-btn text-white font-bold py-3 px-4 transition-all shadow-lg ${agreed
                                ? 'bg-skin-btn hover:brightness-110 active:scale-95'
                                : 'bg-gray-600 opacity-50 cursor-not-allowed'
                            }`}
                    >
                        Sign Up & Get Bonus
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-skin-text opacity-70">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold hover:underline text-white">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;