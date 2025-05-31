import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Form, Input, Button } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { authAPI } from "../../api";

export default function RegisterAdmin() {

  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      const res = await authAPI.registerAdmin(values)

      toast.success(res.data.message || "Đăng ký thành công!")
      setTimeout(() => {
        navigate("/loginAdmin");
      }, 2000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại."
      toast.error(errorMessage)
    }
  }

  const onFinishFailed = () => {
    toast.error("Vui lòng điền đầy đủ và đúng định dạng thông tin!")
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Register Admin</h2>
      <Form name="registerAdmin" layout="vertical" onFinish={onFinish} autoComplete="off" onFinishFailed={onFinishFailed}>
        <Form.Item name="username" label="Username"
          rules={[
            { required: true, message: "Vui lòng nhập username!" },
            { min: 3, message: "Username tối thiểu 3 ký tự" },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item name="email" label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" label="Password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>Đăng ký</Button>
        </Form.Item>
      </Form>
      <ToastContainer position="top-right" />
    </div>
  )
}
