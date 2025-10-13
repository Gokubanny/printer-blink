const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { jwtSecret } = require('../config/env');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return errorResponse(res, 401, 'Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);

      // Get admin from token
      req.admin = await Admin.findById(decoded.id);

      if (!req.admin) {
        return errorResponse(res, 401, 'Admin not found');
      }

      if (!req.admin.isActive) {
        return errorResponse(res, 401, 'Admin account is inactive');
      }

      next();
    } catch (error) {
      return errorResponse(res, 401, 'Not authorized to access this route');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return errorResponse(res, 403, `User role ${req.admin.role} is not authorized to access this route`);
    }
    next();
  };
};