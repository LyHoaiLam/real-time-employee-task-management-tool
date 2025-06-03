import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';  // sửa import đúng
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';
import http from '../../api';
import socket from '../../socket';

export default function Profile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    phoneNumber: '',
    role: '',
  });

  const [currentUserId, setCurrentUserId] = useState(null);
  const [targetUserId, setTargetUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
      setLoading(false);
      return;
    }

    const employeeId = decoded.employeeId;
    if (!employeeId) {
      setLoading(false);
      return;
    }

    setCurrentUserId(employeeId);

    // Nếu role của user là admin, có thể set targetUserId khác (ví dụ để chat với user khác)
    // Hoặc cho phép chọn targetUserId tùy theo UI (ở đây giả định chat admin với 1 user)
    // Bạn có thể thay đổi logic này tùy ý

    http.get(`/employees/${employeeId}`)
      .then(res => {
        const emp = res.data.employee;
        setEmployee(emp);
        setFormData({
          name: emp.name || '',
          email: emp.email || '',
          position: emp.position || '',
          phoneNumber: emp.phoneNumber || '',
          role: emp.role || '',
        });

        // Giả sử nếu user là admin thì chat với user có role user (lấy id user demo)
        if (emp.role === 'admin') {
          // Có thể bạn sẽ load danh sách user hoặc chọn user chat
          // Ở đây tạm gán 1 user id cứng để demo:
          setTargetUserId('683d616fd7b60563560503ed');
        } else {
          // Nếu không phải admin, chat với admin
          setTargetUserId('683d608c01dffede0b7284d0'); 
        }

        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch employee info', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <FaSpinner className="spinner" size={30} />
        <style>{`
          .spinner {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  if (!employee) return <p>Không tìm thấy thông tin người dùng.</p>;

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      position: employee.position || '',
      phoneNumber: employee.phoneNumber || '',
      role: employee.role || '',
    });
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Không tìm thấy token.');

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      return toast.error('Token không hợp lệ.');
    }

    const employeeId = decoded.employeeId;

    http.put(`/employees/${employeeId}`, formData)
      .then(res => {
        const updatedEmp = res.data.employee || res.data;
        setEmployee(updatedEmp);
        setEditing(false);
        toast.success('Cập thông tin của bạn thành công');
      })
      .catch(err => {
        console.error('Failed to update employee info', err);
        toast.error('Cập nhật thông tin của bạn thất bại.');
      });
  };

function ChatBox({ currentUserId, targetUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUserId || !targetUserId) return;
    http.get('/messages', { params: { user1: currentUserId, user2: targetUserId } })
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (
        (data.senderId === currentUserId && data.receiverId === targetUserId) ||
        (data.senderId === targetUserId && data.receiverId === currentUserId)
      ) {
        setMessages(prev => [...prev, data]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.emit('user_connected', currentUserId);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [currentUserId, targetUserId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: targetUserId,
      message: newMessage.trim(),
    };

    socket.emit('send_message', messageData);
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');

    http.post('/messages', messageData).catch(console.error);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 10, maxWidth: 400 }}>
      <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.senderId === currentUserId ? 'right' : 'left',
              backgroundColor: msg.senderId === currentUserId ? '#d1e7dd' : '#f8d7da',
              borderRadius: 10,
              padding: '5px 10px',
              margin: '5px 0',
              maxWidth: '80%',
              marginLeft: msg.senderId === currentUserId ? 'auto' : 0,
            }}
          >
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        style={{ width: '80%', marginRight: 5 }}
      />
      <button onClick={handleSend}>Gửi</button>
    </div>
  );
}

  return (
    <div>
      <ToastContainer />
      <h2>Thông tin người dùng</h2>

      <h1>Realtime Chat</h1>
      {/* Chỉ render chat khi có id user và target */}
      {currentUserId && targetUserId && (
        <ChatBox currentUserId={currentUserId} targetUserId={targetUserId} />
      )}

      {editing ? (
        <>
          <p><strong>Họ tên:</strong><br />
            <input className='input-login-admin' name="name" value={formData.name} onChange={handleChange} />
          </p>
          <p><strong>Email:</strong><br />
            <input className='input-login-admin' name="email" value={formData.email} onChange={handleChange} />
          </p>
          <p><strong>Vị trí:</strong><br />
            <input className='input-login-admin' name="position" value={formData.position} onChange={handleChange} />
          </p>
          <p><strong>Số điện thoại:</strong><br />
            <input className='input-login-admin' name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </p>
          <p>
            <strong>Vai trò:</strong><br />
            <div style={{ cursor: 'not-allowed' }} title="Bạn không thể chỉnh trường này" className='input-login-admin'>
              {formData.role}
            </div>
          </p>

          <button className='button-login-admin' onClick={handleSaveClick}>Lưu</button>
          <button className='buttonPath-head-logout' onClick={handleCancelClick}>Hủy</button>
        </>
      ) : (
        <>
          <p><strong>Họ tên:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Chức vụ:</strong> {employee.position}</p>
          <p><strong>Số điện thoại:</strong> {employee.phoneNumber}</p>
          <p><strong>Vai trò:</strong> {employee.role}</p>
          <button className='button-login-admin' onClick={handleEditClick}>Chỉnh sửa</button>
        </>
      )}
    </div>
  );
}
