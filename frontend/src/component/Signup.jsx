import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Gọi API đăng ký (đúng route backend)
      const res = await axios.post("http://localhost:3000/signup", formData);

      setMessage("✅ " + res.data.message);
      setTimeout(() => navigate("/login"), 1500); // chuyển hướng sau 1.5s
    } catch (err) {
      if (err.response) {
        setMessage("❌ " + err.response.data.message);
      } else {
        setMessage("⚠️ Lỗi kết nối server");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Đăng ký
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

// Một ít CSS inline cho dễ nhìn
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  title: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column" },
  input: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    marginTop: "15px",
  },
};

export default Signup;
