module.exports = (roleRequired) => {
  return (req, res, next) => {
    try {
      // Nếu chưa có req.user => chưa xác thực (chưa login)
      if (!req.user) 
        return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });

      // Kiểm tra quyền nếu roleRequired được truyền
      if (roleRequired && req.user.role !== roleRequired) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
      }

      // Cho phép đi tiếp nếu hợp lệ
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token không hợp lệ!' });
    }
  };
};