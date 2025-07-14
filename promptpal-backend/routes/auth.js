const express = require('express');
const router = express.Router();
const { register, login, getProfile, verifyEmail, googleAuth, resendVerification } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
