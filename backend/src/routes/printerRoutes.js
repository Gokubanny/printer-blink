const express = require('express');
const router = express.Router();
const {
  getAllPrinters,
  getPrinter,
  createPrinter,
  updatePrinter,
  deletePrinter,
  toggleAvailability,
  getPrinterStats
} = require('../controllers/printerController');
const { protect } = require('../middleware/auth');
const {
  printerValidationRules,
  updatePrinterValidationRules,
  idValidationRule,
  validate
} = require('../middleware/validator');

// Public routes
router.get('/', getAllPrinters);
router.get('/:id', idValidationRule(), validate, getPrinter);

// Protected routes (Admin only)
router.post('/', protect, printerValidationRules(), validate, createPrinter);
router.put('/:id', protect, idValidationRule(), updatePrinterValidationRules(), validate, updatePrinter);
router.delete('/:id', protect, idValidationRule(), validate, deletePrinter);
router.patch('/:id/toggle-availability', protect, idValidationRule(), validate, toggleAvailability);
router.get('/admin/stats', protect, getPrinterStats);

module.exports = router;