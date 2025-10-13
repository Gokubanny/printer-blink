const { body, param, query, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }
  next();
};

// Auth validation rules
const emailValidationRule = () => [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

// Printer validation rules
const printerValidationRules = () => [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Printer name is required')
    .isLength({ max: 200 })
    .withMessage('Name cannot exceed 200 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('image')
    .notEmpty()
    .withMessage('Image is required'),
  
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  
  body('category')
    .optional()
    .isIn(['inkjet', 'laser', 'all-in-one', 'photo', 'other'])
    .withMessage('Invalid category'),
  
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Brand cannot exceed 50 characters')
];

const idValidationRule = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

module.exports = {
  validate,
  emailValidationRule,
  printerValidationRules,
  idValidationRule,
};