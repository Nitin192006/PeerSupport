import axios from 'axios';

// 1. Create the Axios Instance
// This acts as a central hub for all your API calls.
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Points to your backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor (The Security Guard)
// Before any request is sent (like "Buy Sticker"), this code runs.
// It checks if you have a login token and attaches it to the request header.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get token from local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach it
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor (The Error Handler)
// This listens for responses. If the server says "401 Unauthorized" (token expired),
// we can catch it here and log the user out automatically in the future.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;