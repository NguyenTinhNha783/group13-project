const mongoose = require("mongoose");

// Schema người dùng
const userSchema = new mongoose.Schema({
  taikhoan: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
   avatar: { type: String }
});

module.exports = mongoose.model("User", userSchema);
