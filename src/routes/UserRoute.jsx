import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../utils/auth";

export function UserRoute({ children }) {
  const role = getRoleFromToken();
  return role === "User Mới" ? children : <Navigate to="/users/login" replace />
}
