const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  
const User = require('./models/User'); 
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);

// Kết nối MongoDB Atlas
mongoose.connect('mongodb+srv://khang223039_db_user:LcnVp6VGUWSIEXAE@group13-project.iwftep5.mongodb.net/groupDB?retryWrites=true&w=majority&appName=group13-project')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));

// Trang gốc
app.get('/', (req, res) => {
  res.send('Server is running and operational! Use /users endpoint for API.'); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
