"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

const page = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    // Listen for new messages via socket
    socket.on('message', msg => {
      setMessages(prev => [...prev, msg]);
    });

    // Optionally receive all messages on 'init'
    socket.on('init', msgs => setMessages(msgs));

    return () => {
      socket.off('message');
      socket.off('init');
    };
  }, []);



  return (
    <div className='max-w-4xl mx-auto p-5 mt-24 border text-white'>
      <h2>Messages</h2>
      <input
        value={user}
        onChange={e => setUser(e.target.value)}
        placeholder="Your name (optional)"
        className='text-white'
      />
      <div style={{ marginBottom: 10 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message"
          style={{ width: '80%', padding: 8, fontSize: 16 }}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        {/* <button onClick={sendMessage} style={{ padding: '8px 16px', marginLeft: 8 }}>Send</button> */}
      </div>
      <ul className='text-white'>
        {messages.map((msg, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <strong>{msg.user}:</strong> {msg.text}
            <span style={{ color: '#888', fontSize: 12, marginLeft: 10 }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default page;