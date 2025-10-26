import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

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
        setAvatarPreview(res.data.avatar || null);
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

  const handleDeleteAccount = async () => {
    if (window.confirm("Bạn có chắc muốn xóa tài khoản này?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("/delete-account", {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Tài khoản đã bị xóa.");
        localStorage.removeItem("token");
        navigate("/login");
      } catch (err) {
        console.error("Xóa tài khoản thất bại:", err);
        alert("Không thể xóa tài khoản.");
      }
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/profile/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Cập nhật ảnh thành công!");
      setUser({ ...user, avatar: res.data.avatar });
      setAvatarFile(null);
    } catch (err) {
      console.error("Upload ảnh thất bại:", err);
      alert("Không thể upload ảnh.");
    }
  };

  if (loading) return <div className="profile-page"><div className="loading-card">Đang tải thông tin người dùng...</div></div>;
  if (error) return <div className="profile-page"><div className="error-card">{error}</div></div>;

  return (
    <div className="profile-page">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>🏠 Trang chủ</div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          {menuOpen && (
            <div className="menu">
              <p onClick={() => navigate("/edit-profile")}>✏️ Chỉnh sửa thông tin</p>
              <p onClick={() => navigate("/change-password")}>🔑 Thay đổi mật khẩu</p>
              <p onClick={handleLogout}>🚪 Đăng xuất</p>
              <p className="delete-account" onClick={handleDeleteAccount}>🗑️ Xóa tài khoản</p>
            </div>
          )}
        </div>
      </header>

      <main className="profile-content">
        <div className="profile-card">
          <div className="avatar-wrapper">
            <img
              src={avatarPreview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="Avatar"
              className="avatar"
            />
            <label htmlFor="avatarInput" className="avatar-overlay" title="Thay đổi ảnh">📷</label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>

          <h2>{user.name || "Không có tên"}</h2>
          <p className="email">{user.email}</p>
          <p className="role">Vai trò: <span>{user.role}</span></p>

          {avatarFile && (
            <button className="upload-btn" onClick={handleUploadAvatar}>Cập nhật ảnh</button>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
