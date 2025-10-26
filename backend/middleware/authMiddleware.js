// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Hàm middleware xác thực người dùng qua token
module.exports = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Không tìm thấy token!' });
    }

    // Token thường có dạng: "Bearer <token>", nên tách lấy phần sau
    const token = authHeader.split(' ')[1];

    // Giải mã token để kiểm tra hợp lệ
    const decoded = jwt.verify(token, 'SECRET_KEY');


    // Lưu thông tin người dùng đã xác thực vào request để dùng ở controller
    req.user = decoded;

    // Cho phép đi tiếp đến bước tiếp theo
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};
