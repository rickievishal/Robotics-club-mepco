"use client"
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute';
import { useAuth } from '@/app/hooks/useAuth';
import { FaUser, FaUsers, FaPaperPlane } from 'react-icons/fa';

import { SOCKET_URL } from '@/app/utils/apiConfig';

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
  forceNew: true
});

const page = () => {
  const { user: authUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authUser) return;

    // Connection status monitoring
    socket.on('connect', () => {
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      setConnectionStatus('error');
    });

    socket.on('reconnect', () => {
      setConnectionStatus('connected');
    });

    socket.on('error-message', (error) => {
      setConnectionStatus('error');
    });

    // Join chatroom when component mounts
    socket.emit('join-chat', {
      _id: authUser._id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role
    });

    setIsJoined(true);
    setIsLoading(false);

    // Listen for new messages
    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for initial messages
    socket.on('init', (initialMessages) => {
      setMessages(initialMessages);
    });

    // Listen for active users updates
    socket.on('active-users', (users) => {
      setActiveUsers(users);
    });

    // Listen for online users updates (real-time online status)
    socket.on('online-users-update', (users) => {
      setOnlineUsers(users);
    });

    // Listen for user join notifications
    socket.on('user-joined', ({ user, timestamp }) => {
      const joinMessage = {
        id: `join-${Date.now()}`,
        text: `${user.name} joined the chat`,
        user: 'System',
        timestamp,
        type: 'system'
      };
      setMessages(prev => [...prev, joinMessage]);
    });

    // Listen for user leave notifications
    socket.on('user-left', ({ user, timestamp }) => {
      const leaveMessage = {
        id: `leave-${Date.now()}`,
        text: `${user.name} left the chat`,
        user: 'System',
        timestamp,
        type: 'system'
      };
      setMessages(prev => [...prev, leaveMessage]);
    });

    return () => {
      socket.off('new-message');
      socket.off('init');
      socket.off('active-users');
      socket.off('online-users-update');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [authUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !isJoined) return;

    socket.emit('send-message', {
      text: text.trim()
    });

    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  if (isLoading) {
    return (
      <RoleProtectedRoute allowedRoles={['member', 'officebearer', 'admin']}>
        <div className="w-full flex justify-center items-center min-h-screen">
          <div className="text-2xl text-gray-400">Loading chatroom...</div>
        </div>
      </RoleProtectedRoute>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={['member', 'officebearer', 'admin']}>
      <div className="w-full max-w-6xl mx-auto p-4 mt-20">
        <div className="bg-[var(--background)] rounded-lg border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--background-light)] p-4 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[var(--primary)]">Chatroom</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                    connectionStatus === 'error' ? 'bg-red-500 animate-pulse' : 
                    'bg-gray-500'
                  }`}></div>
                  <span className="capitalize">{connectionStatus}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUsers className="text-[var(--primary)]" />
                  <span>{activeUsers.length} in chat</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{onlineUsers.length} online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-[600px]">
            {/* Active Users Sidebar */}
            <div className="w-64 bg-[var(--background-light)] border-r border-white/10 p-4">
              <h3 className="text-lg font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
                <FaUser />
                Active Users
              </h3>
              <div className="space-y-2">
                {onlineUsers.map((onlineUser) => {
                  const isInChatroom = activeUsers.some(user => user._id === onlineUser._id);
                  return (
                    <div key={onlineUser._id} className={`flex items-center gap-2 p-2 rounded ${
                      isInChatroom ? 'bg-[var(--primary)]/20 border border-[var(--primary)]/30' : 'bg-black/20'
                    }`}>
                      <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-black text-sm font-bold">
                        {onlineUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium flex items-center gap-1">
                          {onlineUser.name}
                          {isInChatroom && (
                            <span className="text-xs bg-[var(--primary)] text-black px-1.5 py-0.5 rounded-full">
                              In Chat
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-xs capitalize flex items-center gap-1">
                          {onlineUser.role}
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">
                            {onlineUser.lastSeen ? new Date(onlineUser.lastSeen).toLocaleTimeString() : 'Active'}
                          </span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        onlineUser.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                      }`} title={onlineUser.isOnline ? 'Online' : 'Offline'}></div>
                    </div>
                  );
                })}
                {onlineUsers.length === 0 && (
                  <div className="text-gray-400 text-sm text-center py-8">
                    No users online
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((message, index) => (
                  <div key={message.id || index} className={`${
                    message.type === 'system' 
                      ? 'text-center text-gray-400 text-sm italic' 
                      : message.user === authUser?.name
                      ? 'text-right'
                      : 'text-left'
                  }`}>
                    {message.type === 'system' ? (
                      <div className="bg-black/20 rounded-lg px-3 py-1">
                        {message.text}
                      </div>
                    ) : (
                      <div className={`inline-block max-w-xs lg:max-w-md ${
                        message.user === authUser?.name ? 'bg-[var(--primary)] text-black' : 'bg-black/20 text-white'
                      } rounded-lg px-3 py-2`}>
                        {message.user !== authUser?.name && (
                          <div className="text-xs text-gray-300 font-medium mb-1">
                            {message.user}
                          </div>
                        )}
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      text.trim()
                        ? 'bg-[var(--primary)] text-black hover:bg-[var(--primary)]/80'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleProtectedRoute>
  );
}

export default page;

