import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // dùng axiosConfig có baseURL = http://localhost:3000/api
import "./Login.css";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [taikhoan, setTaikhoan] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      // Gửi yêu cầu login đến backend
      const res = await api.post("/login", {
        taikhoan,
        password,
      });

      const { token, user, message } = res.data;

      if (!token || !user) {
        setIsError(true);
        setMessage(message || "Đăng nhập thất bại!");
        return;
      }

      // ✅ Lưu token + thông tin user vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("isLoggedIn", "true");

      if (onLogin) onLogin(user);

      // ✅ Điều hướng theo vai trò
      if (user.role === "admin") navigate("/admin");
      else navigate("/profile");

    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setIsError(true);
      if (err.response?.status === 401) {
        setMessage("Sai tài khoản hoặc mật khẩu!");
      } else {
        setMessage("⚠️ Không thể kết nối tới server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <label>Tên đăng nhập</label>
          <input
            type="text"
            placeholder="Nhập tên tài khoản..."
            value={taikhoan}
            onChange={(e) => setTaikhoan(e.target.value)}
            required
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && (
            <p className={`login-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Chưa có tài khoản?{" "}
            <span
              className="switch-link"
              onClick={() => navigate("/signup")}
            >
              Đăng ký ngay
            </span>
          </p>
          <p>
            <span
              className="switch-link"
              onClick={() => navigate("/forgot-password")}
            >
              Quên mật khẩu?
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
