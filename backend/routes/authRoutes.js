const express = require('express');
const router = express.Router();
const {
  simpleLogin,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { emailValidationRule, validate } = require('../middleware/validator');

// Public routes
router.post('/login', emailValidationRule(), validate, simpleLogin);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;