import api from './api';

// 1. Register User
const register = async (userData) => {
    const response = await api.post('/auth/register', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
    }

    return response.data;
};

// 2. Login User
const login = async (userData) => {
    const response = await api.post('/auth/login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
    }

    return response.data;
};

// 3. Logout User
const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

// 4. Get Current User
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

// 5. Update Profile (Avatar/Name)
const updateProfile = async (formData) => {
    // Note: When sending FormData, axios handles Content-Type automatically
    const response = await api.put('/auth/profile', formData);

    if (response.data) {
        // Update Local Storage with new details
        localStorage.setItem('user', JSON.stringify(response.data));

        // If the backend rotates tokens on update
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
    }

    return response.data;
};

// 6. Update Settings (NEW)
// Updates privacy toggles and syncs local storage
const updateSettings = async (settingsData) => {
    const response = await api.put('/auth/settings', settingsData);

    // Update the local user object so the UI stays in sync
    const user = getCurrentUser();
    if (user) {
        user.settings = response.data;
        localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
};

// 7. Delete Account (NEW)
const deleteAccount = async () => {
    const response = await api.delete('/auth/account');

    // Clean up local storage immediately
    if (response.data) {
        logout();
    }

    return response.data;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    updateSettings,
    deleteAccount
};

export default authService;