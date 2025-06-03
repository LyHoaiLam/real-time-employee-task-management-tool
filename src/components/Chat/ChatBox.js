import React, { useState, useEffect, useRef } from 'react';
import { Input, Button } from 'antd';
import http from '../../api';
import socket from '../../socket';

const ChatBox = ({ currentUserId, targetUserId, employees, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Tên người chat (nếu có employees và targetUserId)
  const targetUser = employees?.find(emp => emp._id === targetUserId);

  // Lấy lịch sử chat
  useEffect(() => {
    if (!currentUserId || !targetUserId) return;
    http.get('/messages', { params: { user1: currentUserId, user2: targetUserId } })
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [currentUserId, targetUserId]);

  // Cuộn xuống cuối mỗi khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Lắng nghe tin nhắn qua socket (nếu bạn dùng socket)
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      // Chỉ nhận tin nhắn đúng chat này
      if (
        (msg.senderId === currentUserId && msg.receiverId === targetUserId) ||
        (msg.senderId === targetUserId && msg.receiverId === currentUserId)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [currentUserId, targetUserId]);

  // Gửi tin nhắn
  const handleSend = () => {
    if (input.trim() === '') return;

    const messagePayload = {
      senderId: currentUserId,
      receiverId: targetUserId,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Gửi lên server qua socket hoặc API
    socket.emit('send_message', messagePayload);
    // Thêm vào messages UI ngay
    setMessages(prev => [...prev, messagePayload]);
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, marginTop: 20, maxWidth: 500 }}>
      <h3>Chat với: {targetUser ? targetUser.name : targetUserId}</h3>
      <div style={{
        minHeight: 150,
        maxHeight: 300,
        border: '1px solid #eee',
        padding: 10,
        marginBottom: 10,
        overflowY: 'auto'
      }}>
        {messages.length === 0 && <p>Chưa có tin nhắn nào.</p>}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.senderId === currentUserId ? 'right' : 'left',
              marginBottom: 8,
            }}
          >
            <span style={{
              display: 'inline-block',
              background: msg.senderId === currentUserId ? '#9fe7a4' : '#eee',
              padding: '6px 12px',
              borderRadius: 12,
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Input.TextArea
        rows={2}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
      />
      <Button type="primary" onClick={handleSend} style={{ marginTop: 8 }}>
        Gửi
      </Button>

      <Button onClick={onClose} style={{ marginTop: 12 }}>
        Đóng chat
      </Button>
    </div>
  );
};

export default ChatBox;
