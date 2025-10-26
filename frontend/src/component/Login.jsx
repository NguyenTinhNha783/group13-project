import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      const res = await axios.post("http://localhost:3000/api/users/login", {
        taikhoan,
        password,
      });

      // Kiểm tra token
      if (res.data && res.data.token) {
        // Lưu token vào localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user?.taikhoan);
        localStorage.setItem("isLoggedIn", "true");

        // Báo cho App biết đã login
        if (onLogin) onLogin();

        // Điều hướng sang Profile
        navigate("/Profile");
      } else {
        setIsError(true);
        setMessage(res.data.message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "⚠️ Lỗi kết nối server!");
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

        <p className="switch-text">
          Chưa có tài khoản?{" "}
          <span className="switch-link" onClick={() => navigate("/Signup")}>
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
