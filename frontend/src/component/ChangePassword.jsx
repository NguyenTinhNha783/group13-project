import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu mới không khớp!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Bạn chưa đăng nhập.");
      return;
    }

    try {
      await axios.put(
        "/profile",
        {
          oldPassword: form.oldPassword,
          password: form.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Đổi mật khẩu thành công!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

      // Tự động quay lại profile sau 1.5 giây
      setTimeout(() => navigate("/profile"), 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="change-password-page">
      <h2>Đổi mật khẩu</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit} className="change-password-form">
        <label>
          Mật khẩu cũ:
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mật khẩu mới:
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Xác nhận mật khẩu mới:
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="primary-btn">
          Đổi mật khẩu
        </button>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => navigate("/profile")}
        >
          ⬅️ Quay lại
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
