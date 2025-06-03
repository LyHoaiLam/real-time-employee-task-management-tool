import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';
import { io } from 'socket.io-client';
import http from '../../api';

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

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  // const [socket, setSocket] = useState(null);
  const ADMIN_ID = '683f5022fc6b94e3af4e3e9e'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    let decoded
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
      setLoading(false);
      return
    }

    const employeeId = decoded.employeeId;
    if (!employeeId) {
      setLoading(false);
      return;
    }

    // Get Information Employee Login In
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
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch employee info', err)
        setLoading(false)
      })

    //GET Meassae user with admin1
    http.get(`/messages?user1=${employeeId}&user2=${ADMIN_ID}`)
      .then(res => {
        setMessages(res.data || []);
      })
      .catch(err => {
        console.error('Không thể lấy tin nhắn', err)
      })



  }, [])

  const handleEditClick = () => setEditing(true);
  const handleCancelClick = () => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        position: employee.position || '',
        phoneNumber: employee.phoneNumber || '',
        role: employee.role || '',
      });
    }
    setEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSaveClick = () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Không tìm thấy token.')

    let decoded
    try {
      decoded = jwtDecode(token);
    } catch {
      return toast.error('Token không hợp lệ.')
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

  // Send message User to Admin
  const handleSendMessage = () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Không tìm thấy token.');

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      return toast.error('Token không hợp lệ.');
    }

    const employeeId = decoded.employeeId;
    if (!newMessage.trim()) return toast.warning('Vui lòng nhập nội dung tin nhắn.');

    http.post('/messages', {
      senderId: employeeId,
      receiverId: ADMIN_ID,
      message: newMessage
    })
    .then(() => {
      toast.success('Gửi tin nhắn thành công!')
      setNewMessage('');
      // Cập nhật lại tin nhắn mới nhất
      return http.get(`/messages?user1=${employeeId}&user2=${ADMIN_ID}`)
    })
    .then(res => {
      setMessages(res.data || [])
    })
    .catch(err => {
      console.error('Gửi tin nhắn thất bại', err)
      toast.error('Gửi tin nhắn thất bại!')
    })
  }

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

  if (!employee) return <p>Không tìm thấy thông Employee</p>

  return (
    <div>
      <ToastContainer />
      <h2>Thông tin người dùng</h2>
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

      <hr style={{ margin: '2rem 0' }} />
      <h3>Tin nhắn với admin</h3>

      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
            <strong>{msg.senderId === ADMIN_ID ? 'Admin' : 'Bạn'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}

      </div>

      <textarea
        placeholder="Nhập tin nhắn gửi admin..."
        className="input-login-admin"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        rows={3}
      />
      <br />
      <button className="button-login-admin" onClick={handleSendMessage}>Gửi tin nhắn</button>
    </div>
  );
}
