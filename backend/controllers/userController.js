const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

// ==========================
//  AUTHENTICATION
// ==========================

// Đăng ký (Sign up)
exports.signup = async (req, res) => {
  try {
    const { taikhoan, name, email, password } = req.body;
    if (!taikhoan || !name || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

    const existingUser = await User.findOne({ taikhoan });
    if (existingUser)
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });

    // Hash password
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
      user: { taikhoan, name, email, role: newUser.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Đăng nhập (Login) - hỗ trợ cả password đã hash và chưa hash
exports.login = async (req, res) => {
  try {
    const { taikhoan, password } = req.body;
    if (!taikhoan || !password)
      return res.status(400).json({ message: "Vui lòng nhập tài khoản và mật khẩu" });

    const user = await User.findOne({ taikhoan });
    if (!user)
      return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });

    let isMatch = false;

    // Nếu password đã hash (bắt đầu bằng $2)
    if (user.password.startsWith("$2")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Nếu password chưa hash
      isMatch = password === user.password;

      // Nếu đúng, hash luôn và lưu vào DB
      if (isMatch) {
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        await user.save();
      }
    }

  if (!isMatch)
      return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });

    // 1. Chuẩn bị payload để đưa vào token
    const userPayload = { userId: user._id, role: user.role };

    // 2. Tạo Access Token (ngắn hạn) và Refresh Token (dài hạn)
    const accessToken = jwt.sign(
      userPayload,
      process.env.JWT_ACCESS_KEY,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      userPayload,
      process.env.JWT_REFRESH_KEY,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // 3. Xóa các refresh token cũ của user này (nếu có) và lưu token mới vào DB
    await RefreshToken.deleteMany({ user: user._id });
    const newRefreshToken = new RefreshToken({ user: user._id, token: refreshToken });
    await newRefreshToken.save();

    // 4. Trả về cả 2 token cho client
    res.json({
      message: "Đăng nhập thành công",
      accessToken, // Token cũ giờ là accessToken
      refreshToken, // Token mới
      user: { taikhoan: user.taikhoan, name: user.name, role: user.role },
    });
    
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  try {
    // Client sẽ gửi refreshToken trong body của request
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Yêu cầu cần có Refresh Token" });
    }

    // Tìm và xóa token tương ứng trong database
    await RefreshToken.deleteOne({ token: refreshToken });

    res.json({ message: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ==========================
//  REFRESH TOKEN
// ==========================

// Tạo mới Access Token từ Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    // 1. Lấy refresh token từ body
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Yêu cầu cần có Refresh Token' });
    }

    // 2. Kiểm tra xem refresh token có tồn tại trong database không
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      // Nếu không có, token đã bị thu hồi (do logout hoặc bị tấn công)
      return res.status(403).json({ message: 'Refresh Token không hợp lệ' });
    }

    // 3. Nếu token có trong DB, xác thực nó (kiểm tra chữ ký và thời gian hết hạn)
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        // Nếu xác thực thất bại (hết hạn, sai chữ ký,...)
        return res.status(403).json({ message: 'Refresh Token không hợp lệ hoặc đã hết hạn' });
      }

      // 4. Nếu mọi thứ đều hợp lệ, tạo một Access Token MỚI
      const newAccessToken = jwt.sign(
        { userId: user.userId, role: user.role }, // Payload lấy từ refresh token đã giải mã
        process.env.JWT_ACCESS_KEY,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
      );

      // 5. Gửi Access Token mới về cho client
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================
//  CRUD NGƯỜI DÙNG (Admin)
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

// ==========================
//  RESET PASSWORD
// ==========================

// Tìm user theo email
exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// Tìm user theo ID
exports.findUserById = async (id) => {
    return await User.findById(id);
};

// Cập nhật password
exports.updatePassword = async (id, newPassword) => {
    const user = await User.findById(id);
    user.password = newPassword; // nhớ hash nếu muốn bảo mật
    await user.save();
    return user;
};

