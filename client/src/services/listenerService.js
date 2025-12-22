import api from './api';

// 1. Fetch All Online Listeners (For the Grid)
const getAllListeners = async (filters = {}) => {
    // Construct query string from filters (e.g., ?tag=Anxiety)
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/listeners?${params}`);
    return response.data;
};

// 2. Get My Listener Profile
// Used to show the user their own stats/tags
const getMyProfile = async () => {
    // In a real app, we might have a specific endpoint for 'me'
    // For now, we can infer or fetch via user ID if needed, 
    // but typically we store this in the User Context or separate endpoint.
    // Assuming backend endpoint exists or we handle it via user updates.
    // For this MVP, we will use the update endpoint to fetch current state if empty
    return null;
};

// 3. Update Profile (Tags, Bio)
const updateProfile = async (profileData) => {
    const response = await api.put('/listeners/profile', profileData);
    return response.data;
};

// 4. Toggle Online/Offline Status
const toggleStatus = async () => {
    const response = await api.put('/listeners/status');
    return response.data; // Returns { isOnline: true/false }
};

const listenerService = {
    getAllListeners,
    getMyProfile,
    updateProfile,
    toggleStatus
};

export default listenerService;