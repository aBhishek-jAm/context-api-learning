import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin@1234';

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (always student role via registration)
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        learningLevel: user.learningLevel,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate a student
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email, role: 'student' });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        learningLevel: user.learningLevel,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Admin login with hardcoded credentials
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a special admin token
      const adminToken = jwt.sign(
        { id: 'admin', role: 'admin', username: ADMIN_USERNAME },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Get all students for admin dashboard
      const students = await User.find({ role: 'student' }).select('-password');

      res.json({
        _id: 'admin',
        name: 'Administrator',
        username: ADMIN_USERNAME,
        role: 'admin',
        token: adminToken,
        studentsCount: students.length,
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all students (admin only)
// @route   GET /api/auth/admin/students
// @access  Private/Admin
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a student (admin only)
// @route   DELETE /api/auth/admin/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.role !== 'student') {
      return res.status(400).json({ message: 'Can only delete student accounts' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get admin analytics (aggregated stats)
// @route   GET /api/auth/admin/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all students
    const allStudents = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });

    const totalStudents = allStudents.length;
    const newLast7Days = allStudents.filter(s => new Date(s.createdAt) >= sevenDaysAgo).length;
    const newLast30Days = allStudents.filter(s => new Date(s.createdAt) >= thirtyDaysAgo).length;

    // Level distribution
    const levelDistribution = {
      beginner: allStudents.filter(s => s.learningLevel === 'beginner').length,
      intermediate: allStudents.filter(s => s.learningLevel === 'intermediate').length,
      advanced: allStudents.filter(s => s.learningLevel === 'advanced').length,
    };

    // Registration trend — daily counts for the last 7 days
    const registrationTrend = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = allStudents.filter(s => {
        const created = new Date(s.createdAt);
        return created >= dayStart && created <= dayEnd;
      }).length;

      registrationTrend.push({
        date: dayStart.toISOString().split('T')[0],
        label: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        count,
      });
    }

    // Get transcript count from the Transcript collection
    let totalTranscripts = 0;
    try {
      const Transcript = (await import('../models/Transcript.js')).default;
      totalTranscripts = await Transcript.countDocuments();
    } catch (e) {
      totalTranscripts = 0;
    }

    // Recent registrations (last 5 students)
    const recentRegistrations = allStudents.slice(0, 5).map(s => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      learningLevel: s.learningLevel,
      createdAt: s.createdAt,
    }));

    res.json({
      totalStudents,
      newLast7Days,
      newLast30Days,
      levelDistribution,
      registrationTrend,
      totalTranscripts,
      recentRegistrations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update student learning level
// @route   PATCH /api/auth/admin/students/:id/level
// @access  Private/Admin
export const updateStudentLevel = async (req, res) => {
  try {
    const { learningLevel } = req.body;
    const validLevels = ['beginner', 'intermediate', 'advanced'];

    if (!learningLevel || !validLevels.includes(learningLevel)) {
      return res.status(400).json({ message: 'Invalid learning level. Must be beginner, intermediate, or advanced.' });
    }

    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.role !== 'student') {
      return res.status(400).json({ message: 'Can only update student accounts' });
    }

    student.learningLevel = learningLevel;
    await student.save();

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      learningLevel: student.learningLevel,
      message: 'Learning level updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Bulk delete students
// @route   POST /api/auth/admin/students/bulk-delete
// @access  Private/Admin
export const bulkDeleteStudents = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of student IDs' });
    }

    // Only delete students (not admins)
    const result = await User.deleteMany({ _id: { $in: ids }, role: 'student' });

    res.json({
      message: `${result.deletedCount} student(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
