const express = require('express');
const router = express.Router();
const {
  getAllPrinters,
  getPrinter,
  createPrinter,
  updatePrinter,
  deletePrinter,
  toggleAvailability
} = require('../controllers/printerController');
const { protect } = require('../middleware/auth');
const {
  printerValidationRules,
  idValidationRule,
  validate
} = require('../middleware/validator');

// Public routes
router.get('/', getAllPrinters);
router.get('/:id', idValidationRule(), validate, getPrinter);

// Protected routes (Admin only)
// TEMPORARY: Remove validation to test
router.post('/', protect, createPrinter);
// router.post('/', protect, printerValidationRules(), validate, createPrinter);

router.put('/:id', protect, idValidationRule(), printerValidationRules(), validate, updatePrinter);
router.delete('/:id', protect, idValidationRule(), validate, deletePrinter);
router.patch('/:id/toggle-availability', protect, idValidationRule(), validate, toggleAvailability);

module.exports = router;