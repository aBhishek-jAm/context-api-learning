import express from 'express';
import { registerUser, loginUser, adminLogin, getAllStudents, deleteStudent, getMe, getAdminAnalytics, updateStudentLevel, bulkDeleteStudents } from '../controllers/authController.js';
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
router.get('/admin/analytics', protect, adminOnly, getAdminAnalytics);
router.patch('/admin/students/:id/level', protect, adminOnly, updateStudentLevel);
router.post('/admin/students/bulk-delete', protect, adminOnly, bulkDeleteStudents);

export default router;
