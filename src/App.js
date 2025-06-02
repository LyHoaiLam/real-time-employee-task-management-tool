import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useMemo, useCallback } from 'react';
import Home from './pages/home';
import PhoneVerification from './pages/phoneVerification';
import SignInEmail from './pages/signInEmail';
import SignInPhone from './pages/signInPhone';
import EmailVerification from './pages/emailVerification';
import Admin from './pages/admin';
import RegisterAdmin from './pages/registerAdmin';
import LoginAdmin from './pages/loginAdmin';
import Profile from './pages/profile';
import LoginUser from './pages/loginUser';
import SetUserAccount from './pages/SetUserAccount';
// import CreateEmployee from './pages/CreateEmployee';
import './App.scss';

function getRoleFromToken() {

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
}

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function isAdmin() {
  return getRoleFromToken() === "admin";
}

function isUser() {
  return getRoleFromToken() === "User";
}

function AdminRoute({ children }) {
  return isAdmin() ? children : <Navigate to="/loginAdmin" replace />;
}

function UserRoute({ children }) {
  return isUser() ? children : <Navigate to="/loginUser" replace />;
}

function ProtectedRedirect({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return children;
  }

  if (isAdmin() && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }

  if (isUser() && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return children
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  const buttons = useMemo(() => [
    { path: '/home', label: 'Home' },
    { path: '/loginUser', label: 'Login User' },
    { path: '/registerAdmin', label: 'Register Admin' },
    { path: '/loginAdmin', label: 'Login For Admin' },
    { path: '/signInPhone', label: 'SignIn Phone' },
    { path: '/phoneVerification', label: 'Phone Verification' },
    { path: '/signInEmail', label: 'SignIn Email' },
    { path: '/emailVerification', label: 'Email Verification' },
    { path: '/setUserAccount', label: 'Set User Account' },
    // { path: '/CreateEmployee', label: 'Create Employee' },
    { path: '/admin', label: 'Admin Manage' },
    { path: '/profile', label: 'Profile (User)' },
    { label: 'Logout', isLogout: true, onClick: handleLogout }
  ], [handleLogout])

  return (
    <div className="App">
      <div style={{ backgroundColor: "pink", display: "flex", justifyContent: "space-evenly", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {buttons.map(({ path, label, isLogout, onClick }) => {
          const isActive = path ? location.pathname === path : false;
          return (
            <button key={label} style={{ flex: "1 1 120px", minWidth: "120px", maxWidth: "150px" }}
              className={isLogout ? "buttonPath-head-logout" : isActive ? "buttonPath-head active" : "buttonPath-head"}
              onClick={isLogout ? onClick : () => navigate(path)}
            >
              {label}
            </button>
          )
        })}
      </div>

      <ProtectedRedirect>
        <Routes>

          <Route
            path="/home"
            element={ <Home /> }
          />

          <Route
            path="/registerAdmin"
            element={ isAuthenticated() ? <Navigate to="/" replace /> : <RegisterAdmin />}
          />

          {/* <Route
            path="/loginUser"
            element={ isAuthenticated() ? <Navigate to="/" replace /> : <LoginUser />}
          /> */}

          <Route
            path="/signInPhone"
            element={ isAuthenticated() ? <Navigate to="/" replace /> : <SignInPhone />}
          />

          <Route
            path="/phoneVerification"
            element={ isAuthenticated() ? <Navigate to="/" replace /> : <PhoneVerification />}
          />

          <Route
            path="/signInEmail"
            element={ isAuthenticated() ? <Navigate to="/" replace /> : <SignInEmail />}
          />

          <Route
            path="/emailVerification"
            element={ isAuthenticated() ? <Navigate to="/" replace /> : <EmailVerification />}
          />

          <Route
            path="/setUserAccount"
            element={ isAuthenticated() ? <Navigate to="/" replace /> : <SetUserAccount /> }
          />

          {/* <Route
            path="/profile"
            element={ isAuthenticated() ? <Profile /> : <Navigate to="/loginUser" replace /> }
          /> */}

            {/* <Route path="/CreateEmployee" element={
              isAuthenticated() ? <Navigate to="/" replace /> : <CreateEmployee />
            } /> */}
          <Route
            path="/loginAdmin"
            element={
              isAuthenticated()
              ? (isAdmin() ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />)
              : <LoginAdmin />
          } />

          <Route
            path="/loginUser"
            element={
              isAuthenticated()
              ? (isUser() ? <Navigate to="/profile" replace /> : <Navigate to="/" replace />)
              : <LoginUser />
          } />


          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />

           <Route path="/profile" element={
            <UserRoute>
              <Profile />
            </UserRoute>
          } />

        </Routes>
      </ProtectedRedirect>
    </div>
  )
}
