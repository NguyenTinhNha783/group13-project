const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

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

module.exports = router;
