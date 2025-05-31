import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../utils/auth";

export function AdminRoute({ children }) {
  const role = getRoleFromToken();
  return role === "admin" ? children : <Navigate to="/loginAdmin" replace />
}
