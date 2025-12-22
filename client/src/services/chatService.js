import io from 'socket.io-client';
import api from './api'; // We need the API bridge for non-socket requests

let socket;

const ChatService = {
    // 1. Initialize Socket Connection
    connect: (token) => {
        if (socket) return socket;

        socket = io('http://localhost:5000', {
            auth: { token },
            transports: ['websocket'], // Force WebSocket for speed
        });

        socket.on('connect', () => {
            console.log('✅ Connected to Chat Server');
        });

        socket.on('connect_error', (err) => {
            console.error('Connection Error:', err);
        });

        return socket;
    },

    // 2. API: Get Chat Details (Partner Info)
    // This uses the route we just made in Step 30
    getDetails: async (chatId) => {
        const response = await api.get(`/chat/${chatId}`);
        return response.data;
    },

    // 3. Socket: Join a Specific Chat Room
    joinRoom: (chatId) => {
        if (!socket) return;
        socket.emit('join_room', chatId);
    },

    // 4. Socket: Send Message (Text, Sticker, or Audio URL)
    sendMessage: (chatId, content, type = 'text') => {
        if (!socket) return;

        const payload = {
            chatId,
            content, // Text or URL
            type,    // 'text', 'sticker', 'audio'
            timestamp: new Date()
        };

        socket.emit('send_message', payload);
        return payload; // Return so UI can update instantly (Optimistic UI)
    },

    // 5. Socket: Send Heartbeat (Anti-Seen-Zone Logic)
    sendHeartbeat: (chatId) => {
        if (!socket) return;
        socket.emit('ping_heartbeat', { chatId });
    },

    // 6. Cleanup
    disconnect: () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    }
};

export default ChatService;