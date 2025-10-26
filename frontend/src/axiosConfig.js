import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/users", // URL backend Node.js của bạn
  withCredentials: false, // cho phép gửi cookie nếu backend dùng cookie để lưu token
});

export default api;
