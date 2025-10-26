import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";
import Profile from "./component/Profile.jsx";
import Admin from "./component/Admin.jsx";
import EditProfile from "./component/EditProfile.jsx";
import ChangePassword from "./component/ChangePassword.jsx";
import api from "./axiosConfig";

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

  // Kiểm tra trạng thái đăng nhập từ server khi tải lại trang
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/check-auth");
        if (response.data.isAuthenticated) {
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
      await api.post("/logout");
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
    } catch (err) {
      console.error("Logout failed:", err.message);
      alert("Đăng xuất thất bại, vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Profile */}
      <Route
        path="/profile"
        element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      
      {/* Edit Profile */}
      <Route
        path="/edit-profile"
        element={isLoggedIn ? <EditProfile /> : <Navigate to="/" />}
      />

      {/* Change Password */}
      <Route
        path="/change-password"
        element={isLoggedIn ? <ChangePassword /> : <Navigate to="/" />}
      />

      {/* Quản lý user */}
      <Route
        path="/admin"
        element={isLoggedIn ? <Admin onLogout={handleLogout} /> : <Navigate to="/" />}
      />

      {/* Redirect tất cả các route khác về "/" */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppWrapper;
