import React, { useState } from 'react';
import socket from './socket/socket';

function App() {
  const [username, setUsername] = useState('');
  const [inputName, setInputName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  React.useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('typing_users', (users) => setTypingUsers(users));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive_message');
      socket.off('typing_users');
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUsername(inputName);
      socket.connect();
      socket.emit('user_join', inputName);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', { message, sender: username });
      setMessage('');
      setTyping(false);
      socket.emit('typing', false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', true);
    }
    if (e.target.value === '') {
      setTyping(false);
      socket.emit('typing', false);
    }
  };

  if (!username) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Login to Chat</h2>
        <form onSubmit={handleLogin}>
          <input
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', border: '1px solid #ccc', borderRadius: 8, padding: 24 }}>
      <h2>Socket.io Chat</h2>
      <div style={{ minHeight: 200, border: '1px solid #eee', padding: 8, marginBottom: 12, background: '#fafafa' }}>
        {messages.map((msg, i) => (
          <div key={i}><b>{msg.sender}:</b> {msg.message}</div>
        ))}
        {typingUsers.length > 0 && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>
            {typingUsers.join(', ')} typing...
          </div>
        )}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={!isConnected || !message.trim()}>Send</button>
      </form>
      <div style={{ marginTop: 12, color: isConnected ? 'green' : 'red' }}>
        {isConnected ? 'Connected' : 'Disconnected'} as <b>{username}</b>
      </div>
    </div>
  );
}

export default App;
