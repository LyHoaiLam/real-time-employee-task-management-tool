import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useChatSocket(userId) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('user_connected', userId);

    return () => newSocket.close();
  }, [userId]);

  function sendMessage(receiverId, message) {
    if (socket) {
      socket.emit('send_message', { senderId: userId, receiverId, message });
    }
  }

  return { socket, sendMessage };
}
