import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Form, Input, Button } from "antd";
import { authAPI } from "../../api";
import "react-toastify/dist/ReactToastify.css";

export default function LoginAdmin() {

  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      const res = await authAPI.loginAdmin(values)
      const data = res.data

      toast.success(data.message || "Đăng nhập thành công!")
      localStorage.setItem("token", data.token)

      setTimeout(() => {
        navigate("/admin")
      }, 2000)
    } catch (err) {
      const message =
        err.response?.data?.message || "Sai tài khoản hoặc mật khẩu"
      toast.error(message)
    }
  }

  const onFinishFailed = () => {
    toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ!")
  }

  return (
    <div>
        <h2>Đăng nhập Admin</h2>
        <Form name="loginAdmin" layout="vertical" onFinish={onFinish} autoComplete="off" onFinishFailed={onFinishFailed}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: "Vui lòng nhập username!" }]}>
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Vui lòng nhập password!" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
          </Form.Item>
        </Form>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />
    </div>
  )
}
