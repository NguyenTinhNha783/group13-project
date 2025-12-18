import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../axiosConfig";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/reset-password/${token}`, { newPassword: password });
      setMessage("✅ Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>🔒 Đặt lại mật khẩu</h2>
        <p className="subtitle">Nhập mật khẩu mới cho tài khoản của bạn</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Xác nhận"}
          </button>
        </form>

        {message && (
          <p
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
