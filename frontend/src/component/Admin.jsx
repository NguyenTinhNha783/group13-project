import React, { useState, useEffect } from "react";
import AddUser from "./AddUser.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Lỗi khi tải user:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = () => fetchUsers();

  const handleDelete = async (userId) => {
    if (window.confirm("Xóa người dùng này?")) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${userId}`);
        alert("Xóa người dùng thành công!");
        fetchUsers();
      } catch (err) {
        console.error("Lỗi khi xóa người dùng:", err);
        alert("Có lỗi xảy ra khi xóa người dùng.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    await axios.put(`http://localhost:3000/api/users/${editingUser._id}`, {
      name,
      email,
    });
    setEditingUser(null);
    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">💼 Quản lý User</h1>
        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
      </div>

      <div className="admin-card">
        <h2 className="admin-subtitle">Thêm User mới</h2>
        <AddUser onAdded={handleUserAdded} />
      </div>

      <div className="admin-card">
        <h2 className="admin-subtitle">Danh sách người dùng</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="admin-actions">
                    <button className="edit-btn" onClick={() => handleEdit(user)}>Sửa</button>
                    <button className="delete-btn" onClick={() => handleDelete(user._id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-users">Không có người dùng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Sửa User: {editingUser.name}</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Tên:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Lưu</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingUser(null)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
