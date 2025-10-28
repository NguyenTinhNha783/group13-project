const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  // Token thực tế, đây là chuỗi JWT dài
  token: {
    type: String,
    required: true,
    unique: true, // Mỗi refresh token là duy nhất
  },
  
  // Liên kết với model User
  // Chúng ta cần biết token này thuộc về user nào
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // 'User' phải trùng với tên model user của bạn
    required: true,
  },
  
  // (Tùy chọn) Thêm ngày hết hạn để có thể tự động xóa token hết hạn trong DB
  // MongoDB sẽ tự động xóa document này sau khi hết hạn
  expiresAt: {
    type: Date,
    // Đặt thời gian tự hủy bằng với thời gian sống của refresh token (ví dụ: 7 ngày)
    // 7 * 24 * 60 * 60 * 1000 = 604800000 milliseconds
    default: Date.now,
    expires: '7d', // Hoặc dùng chuỗi '7d' cho dễ đọc
  },
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;