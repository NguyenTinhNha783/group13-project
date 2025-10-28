const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) { // Thêm kiểm tra 'Bearer ' cho chặt chẽ
      return res.status(401).json({ message: 'Không tìm thấy token hoặc token không đúng định dạng!' });
    }

    // Token có dạng: "Bearer <token>", nên tách phần token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    // Giải mã token
    // Sử dụng khóa bí mật mới từ .env ===
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY); // Phải trùng với key lúc tạo token
    req.user = decoded; // Lưu thông tin user để controller dùng

    // Nếu token hợp lệ, cho phép đi tiếp
    next();
  } catch (err) {
    // Phân biệt lỗi để frontend biết cách xử lý ===
    if (err.name === 'TokenExpiredError') {
      // Nếu lỗi là do token hết hạn, trả về message cụ thể
      return res.status(401).json({ message: 'Token đã hết hạn' });
    }
    // Với các lỗi khác (token sai,...) trả về lỗi chung
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};