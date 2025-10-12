const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { jwtSecret, jwtExpire, adminEmail } = require('../src/config/env');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpire
  });
};

/**
 * @desc    Simple admin login (email-only authentication)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.simpleLogin = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email matches admin email
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return errorResponse(res, 401, 'Invalid admin email');
    }

    // Find or create admin
    let admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      // Create admin if doesn't exist
      admin = await Admin.create({
        email: email.toLowerCase(),
        password: 'default_password_' + Date.now() // Not used in simple auth
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    successResponse(res, 200, 'Login successful', {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register admin with password
 * @route   POST /api/auth/register
 * @access  Public (should be protected in production)
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: email.toLowerCase() });

    if (adminExists) {
      return errorResponse(res, 400, 'Admin already exists');
    }

    // Create admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password
    });

    // Generate token
    const token = generateToken(admin._id);

    successResponse(res, 201, 'Admin registered successfully', {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login admin with password
 * @route   POST /api/auth/login-password
 * @access  Public
 */
exports.loginWithPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    // Check for admin (include password)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    successResponse(res, 200, 'Login successful', {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in admin
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    successResponse(res, 200, 'Admin details retrieved', {
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout admin
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    // In a real application, you might want to blacklist the token
    successResponse(res, 200, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

module.exports = exports;