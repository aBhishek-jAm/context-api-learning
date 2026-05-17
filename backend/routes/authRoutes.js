import express from 'express';
import { registerUser, loginUser, adminLogin, getAllStudents, deleteStudent, getMe } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Admin routes
router.post('/admin/login', adminLogin);
router.get('/admin/students', protect, adminOnly, getAllStudents);
router.delete('/admin/students/:id', protect, adminOnly, deleteStudent);

export default router;
