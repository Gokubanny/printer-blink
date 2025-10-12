const { body, param, validationResult } = require('express-validator');

// Validation middleware to check for errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Printer validation rules
exports.printerValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty().withMessage('Printer name is required')
      .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters'),
    
    body('price')
      .notEmpty().withMessage('Price is required')
      .isNumeric().withMessage('Price must be a number')
      .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    
    body('image')
      .optional()
      .isString().withMessage('Image must be a string'),
    
    body('isAvailable')
      .optional()
      .isBoolean().withMessage('isAvailable must be a boolean'),
    
    body('category')
      .optional()
      .isIn(['inkjet', 'laser', 'all-in-one', 'photo', 'other'])
      .withMessage('Invalid category'),
    
    body('brand')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Brand name cannot exceed 100 characters')
  ];
};

// Update printer validation rules (all fields optional)
exports.updatePrinterValidationRules = () => {
  return [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters'),
    
    body('price')
      .optional()
      .isNumeric().withMessage('Price must be a number')
      .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    
    body('image')
      .optional()
      .isString().withMessage('Image must be a string'),
    
    body('isAvailable')
      .optional()
      .isBoolean().withMessage('isAvailable must be a boolean'),
    
    body('category')
      .optional()
      .isIn(['inkjet', 'laser', 'all-in-one', 'photo', 'other'])
      .withMessage('Invalid category'),
    
    body('brand')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Brand name cannot exceed 100 characters')
  ];
};

// ID parameter validation
exports.idValidationRule = () => {
  return [
    param('id')
      .isMongoId().withMessage('Invalid printer ID')
  ];
};

// Email validation rule
exports.emailValidationRule = () => {
  return [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
  ];
};

module.exports = exports;