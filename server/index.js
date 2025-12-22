require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const listenerRoutes = require('./routes/listenerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const walletRoutes = require('./routes/walletRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Import Payment Routes

// Initialize App
const app = express();
const server = http.createServer(app);

// 1. Database Connection
connectDB();

// 2. Security Middleware
app.use(helmet());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// 3. Real-Time Socket Initialization
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
});

// --- SOCKET.IO EVENT LOGIC ---
io.on('connection', (socket) => {
    console.log(`🔌 Socket Connected: ${socket.id}`);

    // A. Join Chat Room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // B. Handle Messaging (Text, Stickers, etc.)
    socket.on('send_message', (data) => {
        // Broadcast to everyone in the room EXCEPT the sender
        socket.to(data.chatId).emit('receive_message', data);
    });

    // C. Heartbeat
    socket.on('ping_heartbeat', (data) => {
        // Keep connection alive
    });

    // D. Cleanup
    socket.on('disconnect', () => {
        console.log(`❌ Socket Disconnected: ${socket.id}`);
    });
});

// 4. API Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: "PeerSupport API is Secure & Running" });
});

app.use('/api/auth', authRoutes);
app.use('/api/listeners', listenerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes); // Enable Payment Endpoints

// 5. Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on PORT ${PORT}`);
});