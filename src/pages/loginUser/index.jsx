import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Form, Input } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import { authAPI } from '../../api/';

export default function LoginUser() {

  const navigate = useNavigate()
  const onFinish = async (values) => {

    const { username, password } = values
    try {
      const { data } = await authAPI.loginUser({ username, password })

      if (data.token) {
        localStorage.setItem("token", data.token)
        toast.success("Đăng nhập thành công!", {
          autoClose: 1500,
          onClose: () => navigate("/profile"),
        })
      } else {
        toast.error("Token không tồn tại trong phản hồi")
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra"
      toast.error(msg);
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
    toast.error("Vui lòng điền đầy đủ thông tin hợp lệ!")
  }

  return (
    <div>
      <h2>Đăng nhập User</h2>
      <Form name="loginForm" layout="vertical" onFinish={onFinish} autoComplete="off" onFinishFailed={onFinishFailed}>

        <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}>
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>

        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
        </Form.Item>

      </Form>
      <ToastContainer position="top-right" />
    </div>
  )
}

