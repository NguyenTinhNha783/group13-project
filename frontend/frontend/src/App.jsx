import React, { useState, useEffect } from "react";
import AddUser from "./component/AddUser.jsx";
import "./App.css";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  // Lấy danh sách user từ backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Lỗi khi tải user:", err));
  }, []);

  // Thêm user xong thì tải lại danh sách
  const handleUserAdded = () => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <h1 className="title">💼 Quản lý User</h1>

      {/* --- Thêm user mới --- */}
      <div className="card">
        <h2 className="subtitle">Thêm User mới</h2>
        <AddUser onAdded={handleUserAdded} />
      </div>

      {/* --- Danh sách người dùng --- */}
      <div className="card">
        <h2 className="subtitle">Danh sách người dùng</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white" }}>
              <th style={{ padding: "10px", textAlign: "left", width: "40%" }}>Tên</th>
              <th style={{ padding: "10px", textAlign: "left", width: "60%" }}>Email</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center", padding: "15px" }}>
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
