import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // trạng thái sidebar

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
        if (err.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
        } else {
          setError("Không thể tải thông tin người dùng.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-card">Đang tải thông tin người dùng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-card">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          🏠 Trang chủ
        </div>

        {/* Hamburger menu */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>

          {menuOpen && (
            <div className="menu">
              <p onClick={() => navigate("/edit-profile")}>✏️ Chỉnh sửa thông tin</p>
              <p onClick={() => navigate("/change-password")}>🔑 Thay đổi mật khẩu</p>
              <p onClick={handleLogout}>🚪 Đăng xuất</p>
            </div>
          )}
        </div>
      </header>

      <main className="profile-content">
        <div className="profile-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Avatar"
            className="avatar"
          />
          <h2>{user.name || "Không có tên"}</h2>
          <p className="email">{user.email}</p>
          <p className="role">
            Vai trò: <span>{user.role}</span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Profile;
