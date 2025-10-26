import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // URL backend Node.js của bạn
  withCredentials: true, // cho phép gửi cookie nếu backend dùng cookie để lưu token
});

export default api;
