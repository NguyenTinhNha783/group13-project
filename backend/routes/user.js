const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// ---------- HOẠT ĐỘNG 1: AUTHENTICATION ----------
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// ---------- HOẠT ĐỘNG 2: PROFILE ----------
router.get('/profile', authMiddleware, userController.getProfile);  
router.put('/profile', authMiddleware, userController.updateProfile); 

// ---------- QUẢN LÝ USER (ADMIN) ----------
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;