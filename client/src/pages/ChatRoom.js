import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChatService from '../services/chatService';
import authService from '../services/authService';
import api from '../services/api';
import StickerDrawer from '../components/features/StickerDrawer';
import TipModal from '../components/features/TipModal';
// Import the Frame-Aware Avatar Component
import UserAvatar from '../components/common/UserAvatar';

const ChatRoom = () => {
    const { id: chatId } = useParams();
    const navigate = useNavigate();

    // State
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [showStickers, setShowStickers] = useState(false);
    const [showTipModal, setShowTipModal] = useState(false);

    // Partner Details (Now includes Frame)
    const [partner, setPartner] = useState({
        id: null,
        username: "Loading...",
        avatar: "/assets/avatars/default.png",
        equippedFrame: ""
    });

    const messagesEndRef = useRef(null);
    const currentUser = authService.getCurrentUser();

    // 1. Initialize & Fetch Data
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!currentUser || !token) {
            navigate('/login');
            return;
        }

        const initChat = async () => {
            try {
                // A. Connect Socket
                const socket = ChatService.connect(token);
                ChatService.joinRoom(chatId);

                // B. Fetch Participant Details
                const chatData = await ChatService.getDetails(chatId);

                // Determine who is the partner
                let partnerData = null;
                if (chatData.talker._id === currentUser._id) {
                    partnerData = chatData.listener;
                } else {
                    partnerData = chatData.talker;
                }

                setPartner({
                    id: partnerData._id,
                    username: partnerData.username,
                    avatar: partnerData.avatar || "/assets/avatars/default.png",
                    equippedFrame: partnerData.equippedFrame // Get the frame from DB
                });

                // C. Listen for Messages
                socket.on('receive_message', (data) => {
                    setMessages((prev) => [...prev, data]);
                    scrollToBottom();
                });

            } catch (error) {
                console.error("Chat Init Error:", error);
                toast.error("Could not load chat details");
                navigate('/');
            }
        };

        initChat();

        return () => {
            ChatService.disconnect();
        };
    }, [chatId, navigate, currentUser._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 2. Handle Sending (Text)
    const handleSendText = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        sendMessage(inputText, 'text');
        setInputText("");
    };

    // 3. Handle Sending (Sticker)
    const handleSendSticker = (url) => {
        sendMessage(url, 'sticker');
        setShowStickers(false);
    };

    const sendMessage = (content, type) => {
        const msgData = ChatService.sendMessage(chatId, content, type);
        setMessages((prev) => [...prev, { ...msgData, isMe: true }]);
        scrollToBottom();
    };

    // 4. Handle Tip Success
    const handleTipSuccess = (amount) => {
        const systemMsg = {
            id: Date.now(),
            content: `You sent a tip of ${amount} coins! 🎁`,
            type: 'system',
            timestamp: new Date(),
            isMe: true
        };
        setMessages((prev) => [...prev, systemMsg]);
        scrollToBottom();
    };

    const handleEndChat = async () => {
        if (window.confirm("Are you sure you want to end this session?")) {
            try {
                await api.post(`/chat/end/${chatId}`, { reason: 'VOLUNTARY' });
                toast.success("Chat ended.");
                navigate('/');
            } catch (error) {
                toast.error("Error ending chat");
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-skin-base bg-skin-pattern relative">

            {/* HEADER */}
            <header className="h-16 flex items-center justify-between px-6 bg-skin-panel border-b border-white/10 shadow-theme-panel z-10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    {/* UPDATED: Using UserAvatar to show Frame in Chat Header */}
                    <UserAvatar
                        avatar={partner.avatar}
                        frame={partner.equippedFrame}
                        size="w-10 h-10"
                    />

                    <div>
                        <h2 className="font-bold text-skin-text font-main">{partner.username}</h2>
                        <span className="text-xs text-green-400 font-mono">● Online</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowTipModal(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-theme-btn bg-skin-accent/20 border border-skin-accent/50 text-skin-accent hover:bg-skin-accent hover:text-white transition shadow-lg animate-pulse"
                        title="Send Tip"
                    >
                        <i className="fa-solid fa-gift"></i>
                    </button>

                    <button
                        onClick={handleEndChat}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/50 rounded-theme-btn transition text-sm font-bold"
                    >
                        End Chat
                    </button>
                </div>
            </header>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center opacity-50 mt-10 text-skin-text">
                        <p>Start the conversation with {partner.username}...</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.type === 'system' ? 'justify-center' : (msg.isMe ? 'justify-end' : 'justify-start')}`}
                    >
                        {msg.type === 'system' ? (
                            <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold text-skin-text opacity-80 border border-white/5">
                                {msg.content}
                            </div>
                        ) : (
                            <div
                                className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${msg.isMe
                                        ? 'bg-skin-primary text-white rounded-br-none'
                                        : 'bg-skin-panel text-skin-text border border-white/10 rounded-bl-none'
                                    }`}
                            >
                                {msg.type === 'sticker' ? (
                                    <img src={msg.content} alt="sticker" className="w-32 h-32 object-contain drop-shadow-md" />
                                ) : (
                                    <span className="text-sm font-main">{msg.content}</span>
                                )}

                                <div className="text-[10px] opacity-50 text-right mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* MODALS */}
            {showStickers && (
                <StickerDrawer
                    onSelect={handleSendSticker}
                    onClose={() => setShowStickers(false)}
                />
            )}

            {showTipModal && (
                <TipModal
                    recipientId={partner.id}
                    recipientName={partner.username}
                    onClose={() => setShowTipModal(false)}
                    onSuccess={handleTipSuccess}
                />
            )}

            {/* INPUT AREA */}
            <form onSubmit={handleSendText} className="p-4 bg-skin-panel border-t border-white/10 flex gap-2 backdrop-blur-md relative z-20">
                <button
                    type="button"
                    onClick={() => setShowStickers(!showStickers)}
                    className={`w-12 h-12 flex items-center justify-center rounded-theme-btn transition ${showStickers ? 'bg-skin-primary text-white' : 'bg-white/5 hover:bg-white/10 text-skin-text'}`}
                    title="Open Stickers"
                >
                    <i className="fa-solid fa-face-smile text-xl"></i>
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-theme-btn px-4 text-skin-text focus:outline-none focus:border-skin-primary transition"
                />

                <button
                    type="submit"
                    className="w-12 h-12 flex items-center justify-center rounded-theme-btn bg-skin-primary text-white shadow-lg hover:brightness-110 active:scale-95 transition"
                >
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </form>

        </div>
    );
};

export default ChatRoom;