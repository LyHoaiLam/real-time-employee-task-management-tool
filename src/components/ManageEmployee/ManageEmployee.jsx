import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Form, Input, Button, Select } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import { employeeAPI } from '../../api';
import ChatBox from '../Chat/ChatBox';
import { jwtDecode } from 'jwt-decode';

export default function ManageEmployee() {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phoneNumber: '',
    role: 'User',
    task: ''
  });

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll();
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Không tải được danh sách nhân viên');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;
  const decoded = jwtDecode(token);
  setCurrentUserId(decoded.employeeId);
}, []);

  const handleStartChat = (employeeId) => {
    setSelectedUserId(employeeId);
  };

  const handleCreate = async () => {
    try {
      const res = await employeeAPI.create(formData);
      toast.success(res.data.message || 'Tạo nhân viên thành công!');
      setShowModal(false);
      setFormData({
        name: '',
        position: '',
        email: '',
        phoneNumber: '',
        role: 'User',
        task: ''
      });
      fetchEmployees();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Tạo nhân viên thất bại!');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await employeeAPI.delete(id);
      toast.success(res.data.message || 'Xóa nhân viên thành công!');
      fetchEmployees();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Xóa nhân viên thất bại!');
    }
  };


  return (
    <div className="manage">
      <h1 className="manage-title">Manage Employee</h1>
      <div className="manage-div">
        <h1 className="manage-account">Manage Employee</h1>
        <div className="manage-create-filter">
          <Button type="primary" onClick={() => setShowModal(true)}>
            Create Employee
          </Button>
          <Button>Filter</Button>
        </div>
      </div>

      <div className="manage-employee-div">
        <p className="manage-employee">Employee Name</p>
        <p className="manage-employee">Email</p>
        <p className="manage-employee">Status</p>
        <p className="manage-employee">Action</p>
        <p className="manage-employee"></p>
      </div>

      <div>
        {employees.map((employee) => (
          <div
            key={employee._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px',
              borderBottom: '1px solid #ddd'
            }}
          >
            <div style={{ width: '25%' }}>{employee.name}</div>
            <div style={{ width: '25%' }}>{employee.email}</div>
            <div style={{ width: '25%' }}>{employee.isVerified ? 'Active' : 'Inactive'}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button danger onClick={() => handleDelete(employee._id)}>
                Delete
              </Button>
              <Button type="primary" onClick={() => handleStartChat(employee._id)}>
                Chat
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Create New Employee"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleCreate}
        okText="Create"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Employee Name" required>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Position" required>
            <Input name="position" value={formData.position} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Email Address" required>
            <Input name="email" value={formData.email} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Phone Number" required>
            <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Role" required>
            <Select value={formData.role} onChange={(value) => setFormData({ ...formData, role: value })}>
              <Select.Option value="User">User</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Task">
            <Input name="task" value={formData.task} onChange={handleChange} />
          </Form.Item>
        </Form>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

{selectedUserId && currentUserId && (
  <ChatBox
    currentUserId={currentUserId}
    targetUserId={selectedUserId}
    employees={employees}
    onClose={() => setSelectedUserId(null)}
  />
)}

    </div>
  );
}
