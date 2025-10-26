import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }

    axios
      .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser({ name: res.data.name, email: res.data.email }))
      .catch(() => {
        setError("Không thể tải thông tin người dùng.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put("/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Cập nhật thông tin thành công!");
      setError("");

      // Chuyển sang Profile sau 1 giây để người dùng nhìn thấy thông báo
      setTimeout(() => {
        navigate("/profile");
      }, 1000);

    } catch (err) {
      setError("Cập nhật thất bại.");
      setSuccess("");
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="edit-profile-page">
      <h2>Chỉnh sửa thông tin cá nhân</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>
          Tên:
          <input type="text" name="name" value={user.name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={user.email} onChange={handleChange} />
        </label>

        {/* Nút Cập nhật */}
        <button type="submit" className="primary-btn">Cập nhật</button>

        {/* Nút Quay lại */}
        <button type="button" className="secondary-btn" onClick={() => navigate("/profile")}>
          ⬅️ Quay lại
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
