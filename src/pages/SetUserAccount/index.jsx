// import { useLocation, useNavigate } from "react-router-dom";
// import { Form, Input, Button } from "antd";
// import { toast, ToastContainer } from "react-toastify";
// import { authAPI } from "../../api";
// import "react-toastify/dist/ReactToastify.css";

// export default function SetUserAccount() {

//   const location = useLocation()
//   const token = location.state?.token
//   const navigate = useNavigate()

//   const onFinish = async (values) => {
//     try {
//       const { data } = await authAPI.setupEmployeeAccount({
//         token,
//         username: values.username,
//         password: values.password,
//       });

//       toast.success(data.message || "Tạo tài khoản thành công")
//       setTimeout(() => {
//         navigate("/loginUser");
//       }, 1500)
//     } catch (error) {
//       const errMsg = error.response?.data?.message || "Lỗi khi tạo tài khoản."
//       toast.error(errMsg)
//     }
//   }

//   if (!token) {
//     return (
//       <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
//         <h2>Thiết lập tài khoản</h2>
//         <p style={{ color: "red", fontWeight: "bold" }}>
//           Bạn phải tạo nhân viên mới dùng tính năng này được.
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
//       <h2>Thiết lập tài khoản</h2>
//       <Form layout="vertical" onFinish={onFinish}>
//         <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}>
//           <Input placeholder="Tên đăng nhập" />
//         </Form.Item>
//         <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
//           <Input.Password placeholder="Mật khẩu" />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>Tạo tài khoản</Button>
//         </Form.Item>
//       </Form>
//       <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored"
//       />
//     </div>
//   )
// }


import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { authAPI } from "../../api";
import "react-toastify/dist/ReactToastify.css";

export default function SetUserAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy token từ query param
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const onFinish = async (values) => {
    try {
      const { data } = await authAPI.setupEmployeeAccount({
        token,
        username: values.username,
        password: values.password,
      });

      toast.success(data.message || "Tạo tài khoản thành công");
      setTimeout(() => {
        navigate("/loginUser");
      }, 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Lỗi khi tạo tài khoản.";
      toast.error(errMsg);
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
        <h2>Thiết lập tài khoản</h2>
        <p style={{ color: "red", fontWeight: "bold" }}>
          Link xác thực không hợp lệ hoặc đã hết hạn.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Thiết lập tài khoản</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />
    </div>
  );
}

