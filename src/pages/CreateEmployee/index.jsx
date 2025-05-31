import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { employeeAPI } from "../../api";
import "react-toastify/dist/ReactToastify.css";

export default function CreateEmployee() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const { data } = await employeeAPI.create(values);
      const token = data.token;

      if (!token) {
        toast.error("Không lấy được token xác minh từ backend");
        setLoading(false);
        return;
      }

      toast.success("Tạo employee thành công!");
      setTimeout(() => {
        navigate("/setUserAccount", { state: { token } });
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Tạo employee thất bại!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Tạo Employee mới</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: "",
          position: "",
          email: "",
          phoneNumber: "",
          role: "",
          task: "",
        }}
      >
        <Form.Item name="name" label="Họ và tên Employee" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
          <Input placeholder="Lý Hoài Lâm" />
        </Form.Item>

        <Form.Item name="position" label="Vị trí" rules={[{ required: true, message: "Vui lòng vị trí" }]}>
          <Input placeholder="Developer" />
        </Form.Item>

        <Form.Item name="email" label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="lyhoailam@gmail.com" />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
          <Input placeholder="036268062" />
        </Form.Item>

        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Vui lòng nhập vai trò!" }]}>
          <Input placeholder="Employee" />
        </Form.Item>

        <Form.Item name="task" label="Task" rules={[{ required: true, message: "Vui lòng nhập nhiệm vụ!" }]}>
          <Input placeholder="Pendding, Sucess, In Process" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? "Đang tạo..." : "Tạo Employee"}
          </Button>
        </Form.Item>
      </Form>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />
    </div>
  )
}
