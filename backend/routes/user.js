const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); // hàm gửi email
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ---------- HOẠT ĐỘNG 1: AUTHENTICATION ----------
// Đăng ký
router.post('/signup', userController.signup);
// Đăng nhập
router.post('/login', userController.login);
// Đăng xuất
router.post('/logout', userController.logout);

// ---------- HOẠT ĐỘNG 2: PROFILE ----------
// Xem profile
router.get('/profile', authMiddleware, userController.getProfile);
// Cập nhật profile
router.put('/profile', authMiddleware, userController.updateProfile);

// ---------- HOẠT ĐỘNG 3: QUẢN LÝ USER (ADMIN) ----------
// Lấy danh sách user
router.get('/', authMiddleware, authorize('admin'), userController.getUsers);
// Thêm user mới
router.post('/', authMiddleware, authorize('admin'), userController.createUser);
// Cập nhật user theo id
router.put('/:id', authMiddleware, authorize('admin'), userController.updateUser);
// Xóa user theo id
router.delete('/:id', authMiddleware, authorize('admin'), userController.deleteUser);

// Quên mật khẩu - gửi token reset
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Vui lòng nhập email' });

    try {
        const user = await userController.findUserByEmail(email);
        if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

        // Tạo token reset JWT 1h
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1h' }
        );

        const resetUrl = `http://localhost:3000/users/reset-password/${resetToken}`;

        const message = `
            <p>Bạn yêu cầu đặt lại mật khẩu.</p>
            <p>Nhấn vào link sau để đổi mật khẩu:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Link có hiệu lực 1 giờ.</p>
        `;

        // Gửi email 1 lần duy nhất
        await sendEmail({ 
            to: email, 
            subject: 'Đặt lại mật khẩu', 
            html: message 
        });

        res.json({ message: 'Đã gửi email chứa link đặt lại mật khẩu!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi gửi email hoặc server' });
    }
});

// Đổi mật khẩu với token reset
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        const user = await userController.findUserById(decoded.userId);
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        // Hash password trước khi lưu
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userController.updatePassword(user._id, hashedPassword);

        res.json({ message: 'Đổi mật khẩu thành công!' });
    } catch (err) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
});

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
// Storage cho multer + cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars', // thư mục trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});
const parser = multer({ storage });

// Upload avatar
router.post('/upload-avatar', authMiddleware, parser.single('avatar'), async (req, res) => {
    try {
        const user = await userController.findUserById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        if (!req.file) return res.status(400).json({ message: 'Không tìm thấy file upload' });

        user.avatar = req.file.path; // lưu URL Cloudinary
        await user.save();

        res.json({ message: 'Upload avatar thành công!', avatar: user.avatar });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
