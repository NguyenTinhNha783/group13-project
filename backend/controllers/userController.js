const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
//  AUTHENTICATION
// ==========================

// Đăng ký (Sign up)
exports.signup = async (req, res) => {
  try {
    const { taikhoan, name, email, password } = req.body;
    if (!taikhoan || !name || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

    // Kiểm tra tài khoản đã tồn tại chưa
    const existingUser = await User.findOne({ taikhoan });
    if (existingUser)
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      taikhoan,
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    await newUser.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      user: { taikhoan, name, email },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Đăng nhập (Login)
exports.login = async (req, res) => {
  try {
    const { taikhoan, password } = req.body;
    if (!taikhoan || !password)
      return res.status(400).json({ message: "Vui lòng nhập tài khoản và mật khẩu" });

    const user = await User.findOne({ taikhoan });
    if (!user)
      return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });

    const token = jwt.sign({ userId: user._id }, "SECRET_KEY", { expiresIn: "1h" });

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: { taikhoan: user.taikhoan, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Đăng xuất (Logout)
exports.logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
};

// ====================
//  CRUD NGƯỜI DÙNG 
// ====================

// GET: Lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// POST: Thêm user mới
exports.createUser = async (req, res) => {
  try {
    const { taikhoan, name, email, password, role } = req.body;
    if (!taikhoan || !name || !email || !password)
      return res.status(400).json({ message: "Thiếu taikhoan, name, email hoặc password" });

    const existingUser = await User.findOne({ taikhoan });
    if (existingUser)
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      taikhoan,
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    res.status(201).json({ message: "Thêm user thành công", newUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// PUT: Sửa user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ message: "Cập nhật thành công", user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// DELETE: Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ==========================
//  PROFILE
// ==========================

// GET /profile - xem thông tin cá nhân
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("taikhoan name email role");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// PUT /profile - cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const updateData = req.body;
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Cập nhật thông tin cá nhân thành công", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
