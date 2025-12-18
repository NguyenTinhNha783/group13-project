import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";
import Profile from "./component/Profile.jsx";
import Admin from "./component/Admin.jsx";
import EditProfile from "./component/EditProfile.jsx";
import ForgotPassword from "./component/ForgotPassword.jsx";
import ResetPassword from "./component/ResetPassword.jsx";
import ChangePassword from "./component/ChangePassword.jsx";
import api from "./axiosConfig"; // baseURL = http://localhost:3000/

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        const response = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.email) {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("isLoggedIn");
        }
      } catch (err) {
        console.warn("Auth check failed:", err.message);
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  return (
    <Routes>
      {/* Trang đăng nhập */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />

      {/* Trang đăng ký */}
      <Route path="/signup" element={<Signup />} />

      {/* Quên mật khẩu */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ✅ Reset mật khẩu */}
      <Route path="/users/reset-password/:token" element={<ResetPassword />} /> 

      {/* Hồ sơ người dùng */}
      <Route
        path="/profile"
        element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/" />}
      />

      {/* Chỉnh sửa hồ sơ */}
      <Route
        path="/edit-profile"
        element={isLoggedIn ? <EditProfile /> : <Navigate to="/" />}
      />

      {/* Đổi mật khẩu */}
      <Route
        path="/change-password"
        element={isLoggedIn ? <ChangePassword /> : <Navigate to="/" />}
      />

      {/* Trang admin */}
      <Route
        path="/admin"
        element={isLoggedIn ? <Admin onLogout={handleLogout} /> : <Navigate to="/" />}
      />

      {/* Route mặc định */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppWrapper;
