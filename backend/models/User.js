const mongoose = require("mongoose");

// Schema người dùng
const userSchema = new mongoose.Schema({
  taikhoan: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
<<<<<<< HEAD
   avatar: { type: String }
});

module.exports = mongoose.model("User", userSchema);
=======
  avatar: { type: String }
});

module.exports = mongoose.model("User", userSchema);
>>>>>>> 2ab4e8920067af3b26b4e972f3b1313c4ae18f61
