import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Call the Service
            await authService.login({ email, password });

            // 2. Success Feedback
            toast.success('Welcome back!');

            // 3. Redirect to Dashboard
            navigate('/');
        } catch (error) {
            // 4. Error Handling
            // Extract error message from backend response
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            toast.error(message);
        }
    };

    return (
        <div className="flex items-center justify-center h-full w-full pt-20">
            {/* DYNAMIC THEME CLASSES:
         bg-skin-panel -> Uses var(--panel-bg) (Your texture/image)
         rounded-theme-panel -> Uses var(--panel-radius)
         shadow-theme-panel -> Uses var(--panel-shadow)
      */}
            <div className="bg-skin-panel rounded-theme-panel shadow-theme-panel p-8 w-96 max-w-full border border-white/10 backdrop-blur-md">

                <h1 className="text-3xl font-main font-bold text-skin-text text-center mb-6">
                    Login
                </h1>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
                            placeholder="Enter password"
                            className="p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    {/* DYNAMIC BUTTON:
             bg-skin-btn -> Uses var(--btn-primary-bg)
             rounded-theme-btn -> Uses var(--btn-radius)
          */}
                    <button
                        type="submit"
                        className="mt-4 bg-skin-btn rounded-theme-btn text-white font-bold py-3 px-4 hover:brightness-110 active:scale-95 transition-all shadow-lg"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-skin-text opacity-70">
                        New here?{' '}
                        <Link to="/register" className="font-bold hover:underline text-white">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;