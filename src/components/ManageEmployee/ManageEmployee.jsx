import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Form, Input, Button, Select } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import Employee from "../Employee/Employee";
import { employeeAPI } from '../../api';

export default function ManageEmployee() {

  const [showModal, setShowModal] = useState(false)
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phoneNumber: '',
    role: 'User',
    task: ''
  })

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll()
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Không tải được danh sách nhân viên')
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCreate = async () => {
    try {
      const res = await employeeAPI.create(formData)
      toast.success(res.data.message || "Tạo nhân viên thành công!")
      setShowModal(false)
      setFormData({
        name: '',
        position: '',
        email: '',
        phoneNumber: '',
        role: 'User',
        task: ''
      })
      fetchEmployees()
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Tạo nhân viên thất bại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await employeeAPI.delete(id)

      toast.success(res.data.message || "Xóa nhân viên thành công!");
      fetchEmployees()
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Xóa nhân viên thất bại!")
    }
  }

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
          <Employee key={employee._id} id={employee._id} name={employee.name} email={employee.email}
            status={employee.isVerified ? "Active" : "Inactive"}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal title="Create New Employee" open={showModal} onCancel={() => setShowModal(false)} onOk={handleCreate} okText="Create" cancelText="Cancel">
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
            <Select
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
            >
              <Select.Option value="User">User</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Task">
            <Input name="task" value={formData.task} onChange={handleChange} />
          </Form.Item>
        </Form>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  )
}
