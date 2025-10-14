let users = [
  { id: 1, name: "Nguyễn Tịnh Nhã", email: "nha226435@student.nctu.edu.vn" },
  { id: 2, name: "Lâm Hoàng Khang", email: "khang223039@student.nctu.edu.vn" },
  { id: 3, name: "Từ Công Vinh", email: "vinh222918@student.nctu.edu.vn" }
];

exports.getUsers = (req, res) => {
  res.json(users);
};
exports.addUser = (req, res) => {
  if (!req.body || !req.body.name || !req.body.email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};
