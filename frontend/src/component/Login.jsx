import React, { useState } from "react";
import api from "../axiosConfig";
import "../App.css";

function Dangnhap({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/login", { username, password },{ withCredentials: false });
      alert("✅ Đăng nhập thành công!");
      onLogin(true);
    } catch (err) {
      alert("❌ Sai tên tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <label>Tên tài khoản:</label>
        <input
          type="text"
          placeholder="Nhập tên tài khoản..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Mật khẩu:</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Dangnhap;
