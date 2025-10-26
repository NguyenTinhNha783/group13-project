const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  taikhoan: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
});
module.exports = mongoose.model("User", userSchema);