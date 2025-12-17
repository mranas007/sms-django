import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSend, FiArrowLeft, FiMoreVertical, FiPhone, FiVideo } from 'react-icons/fi';

import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../../../constant/TokensConstant";

export default function ChatRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const socket = useRef(null);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.user_id);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            console.error("No access token found");
            return;
        }

        const wsUrl = `ws://127.0.0.1:8000/ws/chat/group/${id}/?token=${token}`;
        socket.current = new WebSocket(wsUrl);

        socket.current.onopen = () => {
            console.log('WebSocket Connected');
            setConnectionStatus('Online');
        };

        socket.current.onclose = () => {
            console.log('WebSocket Disconnected');
            setConnectionStatus('Offline');
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            let currentUserId = null;
            try {
                const decoded = jwtDecode(token);
                currentUserId = decoded.user_id;
            } catch (e) { }

            if (data.type === 'connection_established') {
                if (data.chats) {
                    const formattedChats = data.chats.map(chat => ({
                        id: chat.id,
                        text: chat.message,
                        sender: chat.sender_email || 'User',
                        isMe: chat.sender === currentUserId,
                        senderId: chat.sender,
                        time: new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }));
                    setMessages(formattedChats);
                }
            } else if (data.type === 'chat_message') {
                const chat = data.chat || data;
                setMessages(prev => [...prev, {
                    id: chat.id || Date.now(),
                    text: chat.message,
                    sender: chat.sender_email || 'User',
                    isMe: chat.sender === currentUserId,
                    senderId: chat.sender,
                    time: new Date(chat.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        };

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({ message: inputText }));
        }

        // Optimistic update? Or wait for 'chat_message' echo?
        // The consumer broadcasts to everyone including sender. 
        // So we might get a duplicate if we also add it here. 
        // Let's rely on the broadcast for now to be safe, or implement deduplication.

        setInputText('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
            {/* 
        height calculation assumes a standard 64px navbar. 
        Adjust if your layout is different. 
      */}

            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/teacher/chat/groups')}
                        className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
                    >
                        <FiArrowLeft size={20} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {/* Group Initials */}
                            10A
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900 leading-tight">Class 10-A Mathematics</h2>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiPhone size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiVideo size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiMoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2 shadow-sm ${msg.isMe
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                                }`}
                        >
                            {!msg.isMe && (
                                <p className="text-xs font-bold text-indigo-600 mb-1">{msg.sender}</p>
                            )}
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-indigo-200' : 'text-gray-400'
                                }`}>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-5xl mx-auto">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex-shrink-0"
                    >
                        <FiSend size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
