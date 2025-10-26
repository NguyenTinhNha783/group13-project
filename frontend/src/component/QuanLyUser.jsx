import React, { useState, useEffect } from "react";
import AddUser from "./AddUser.jsx";
import axios from "axios";
import "../App.css";

function QuanLyUser() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Lỗi khi tải user:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Xóa người dùng này ?")) {
      try {
        await axios.delete(`http://localhost:3000/${userId}`);
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
    await axios.put(`http://localhost:3000/${editingUser._id}`, {
      name,
      email,
    });
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div className="container">
      <h1 className="title">💼 Quản lý User</h1>

      <div className="card">
        <h2 className="subtitle">Thêm User mới</h2>
        <AddUser onAdded={handleUserAdded} />
      </div>

      <div className="card">
        <h2 className="subtitle">Danh sách người dùng</h2>
        {/* Bảng danh sách user */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white" }}>
              <th style={{ padding: "10px", textAlign: "left", width: "30%" }}>
                Tên
              </th>
              <th style={{ padding: "10px", textAlign: "left", width: "40%" }}>
                Email
              </th>
              <th
                style={{ padding: "10px", textAlign: "center", width: "30%" }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td style={{ padding: "10px" }}>{user.name}</td>
                  <td style={{ padding: "10px" }}>{user.email}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{ marginRight: "8px" }}
                    >
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(user._id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "15px" }}
                >
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {editingUser && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <h3>Sửa User: {editingUser.name}</h3>
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: "10px" }}>
                <label>Tên: </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginLeft: "10px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Email: </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginLeft: "10px" }}
                />
              </div>
              <button type="submit" style={{ marginRight: "8px" }}>
                Lưu
              </button>
              <button type="button" onClick={() => setEditingUser(null)}>
                Hủy
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuanLyUser;
