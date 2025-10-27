import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // dùng chung với Login

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taikhoan: "",
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:3000/users/signup",
        formData
      );
      setIsError(false);
      setMessage("🎉 " + res.data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setIsError(true);
      if (err.response) {
        setMessage("❌ " + err.response.data.message);
      } else {
        setMessage("⚠️ Lỗi kết nối đến server!");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Đăng ký tài khoản</h2>

        <form onSubmit={handleSubmit}>
          <label>Tên đăng nhập</label>
          <input
            type="text"
            name="taikhoan"
            placeholder="Nhập tên đăng nhập..."
            value={formData.taikhoan}
            onChange={handleChange}
            required
          />

          <label>Họ và tên</label>
          <input
            type="text"
            name="name"
            placeholder="Nhập họ và tên..."
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Nhập email..."
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu..."
            value={formData.password}
            onChange={handleChange}
            required
          />

          {message && (
            <p className={`auth-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <button type="submit" className="auth-btn">
            Đăng ký
          </button>
        </form>

        <p className="switch-text">
          Đã có tài khoản?{" "}
          <span className="switch-link" onClick={() => navigate("/login")}>
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
