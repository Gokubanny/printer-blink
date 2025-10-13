const Printer = require('../models/Printer');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all printers
 * @route   GET /api/printers
 * @access  Public
 */
exports.getAllPrinters = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, isAvailable } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const printers = await Printer.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Printer.countDocuments(query);

    paginatedResponse(res, 200, 'Printers retrieved successfully', printers, {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single printer
 * @route   GET /api/printers/:id
 * @access  Public
 */
exports.getPrinter = async (req, res, next) => {
  try {
    const printer = await Printer.findById(req.params.id);

    if (!printer) {
      return errorResponse(res, 404, 'Printer not found');
    }

    // Increment views
    printer.views += 1;
    await printer.save();

    successResponse(res, 200, 'Printer retrieved successfully', printer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new printer
 * @route   POST /api/printers
 * @access  Private (Admin)
 */
exports.createPrinter = async (req, res, next) => {
  try {
    console.log('=== BACKEND CREATE PRINTER DEBUG ===');
    console.log('Request body received:', JSON.stringify(req.body, null, 2));
    console.log('Request body type:', typeof req.body);
    console.log('Request headers:', req.headers['content-type']);
    
    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('Request body is EMPTY');
      return res.status(400).json({
        success: false,
        message: 'Request body is empty',
        receivedBody: req.body
      });
    }

    const { name, price, image, description, isAvailable = true, category = 'other', brand = '' } = req.body;

    console.log('Parsed fields:', {
      name: name ? `"${name}" (length: ${name.length})` : 'MISSING',
      price: price !== undefined ? price : 'MISSING',
      description: description ? `"${description}" (length: ${description.length})` : 'MISSING',
      image: image ? `PRESENT (length: ${image.length})` : 'MISSING',
      isAvailable: isAvailable,
      category: category,
      brand: brand
    });

    // Manual validation
    const missingFields = [];
    if (!name || name.trim() === '') missingFields.push('name');
    if (price === undefined || price === null) missingFields.push('price');
    if (!description || description.trim() === '') missingFields.push('description');
    if (!image || image.trim() === '') missingFields.push('image');

    if (missingFields.length > 0) {
      console.log('Manual validation failed - missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missing: missingFields,
        receivedData: {
          name: !!name,
          price: price !== undefined,
          description: !!description,
          image: !!image
        }
      });
    }

    // Validate price is a number
    if (isNaN(parseFloat(price))) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid number'
      });
    }

    console.log('All validation passed - creating printer...');

    const printer = await Printer.create({
      name: name.trim(),
      price: parseFloat(price),
      image: image,
      description: description.trim(),
      isAvailable,
      category,
      brand
    });

    console.log('Printer created successfully:', printer._id);
    successResponse(res, 201, 'Printer created successfully', printer);
  } catch (error) {
    console.error('Create printer error:', error);
    next(error);
  }
};

/**
 * @desc    Update printer
 * @route   PUT /api/printers/:id
 * @access  Private (Admin)
 */
exports.updatePrinter = async (req, res, next) => {
  try {
    let printer = await Printer.findById(req.params.id);

    if (!printer) {
      return errorResponse(res, 404, 'Printer not found');
    }

    const { name, price, image, description, isAvailable, category, brand } = req.body;
    const updateData = { name, price, description, isAvailable, category, brand };

    // Handle image update
    if (image && image !== printer.image) {
      updateData.image = image;
    }

    printer = await Printer.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    successResponse(res, 200, 'Printer updated successfully', printer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete printer
 * @route   DELETE /api/printers/:id
 * @access  Private (Admin)
 */
exports.deletePrinter = async (req, res, next) => {
  try {
    const printer = await Printer.findById(req.params.id);

    if (!printer) {
      return errorResponse(res, 404, 'Printer not found');
    }

    await printer.deleteOne();

    successResponse(res, 200, 'Printer deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle printer availability
 * @route   PATCH /api/printers/:id/toggle-availability
 * @access  Private (Admin)
 */
exports.toggleAvailability = async (req, res, next) => {
  try {
    const printer = await Printer.findById(req.params.id);

    if (!printer) {
      return errorResponse(res, 404, 'Printer not found');
    }

    printer.isAvailable = !printer.isAvailable;
    await printer.save();

    successResponse(res, 200, 'Printer availability updated', printer);
  } catch (error) {
    next(error);
  }
};

module.exports = exports;