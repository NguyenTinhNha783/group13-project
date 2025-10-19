let users = [
  { id: 1, name: "Nguyễn Tịnh Nhã", email: "nha226435@student.nctu.edu.vn" },
  { id: 2, name: "Lâm Hoàng Khang", email: "khang223039@student.nctu.edu.vn" },
  { id: 3, name: "Từ Công Vinh", email: "vinh222918@student.nctu.edu.vn" }
];

// GET: lấy danh sách user
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST: thêm user mới (basic validation)
exports.createUser = (req, res) => {
  if (!req.body || !req.body.name || !req.body.email) {
    return res.status(400).json({ message: "Name và email là bắt buộc" });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: req.body.name,
    email: req.body.email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

// PUT: sửa user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id == id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    return res.json(users[index]);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

// DELETE: xóa user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const exists = users.some(u => u.id == id);
  if (!exists) return res.status(404).json({ message: "User not found" });

  users = users.filter(u => u.id != id);
  res.json({ message: "User deleted" });
};
