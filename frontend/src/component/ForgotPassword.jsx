import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/users/forgot-password", {
        email,
      });

      setMessage(res.data.message || "Hướng dẫn reset đã được gửi tới email của bạn.");
      setIsError(false);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2>Quên mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label>Nhập email của bạn</label>
          <input
            type="email"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message && (
            <p className={`forgot-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>

        <p className="back-login" onClick={() => navigate("/login")}>
          ⬅️ Quay lại đăng nhập
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
