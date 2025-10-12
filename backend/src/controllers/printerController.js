const Printer = require('../models/Printer');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { uploadToCloudinary, deleteFromCloudinary, isValidBase64Image } = require('../utils/imageProcessor');

/**
 * @desc    Get all printers
 * @route   GET /api/printers
 * @access  Public
 */
exports.getAllPrinters = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, isAvailable, category, sortBy = '-createdAt' } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const printers = await Printer.find(query)
      .sort(sortBy)
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
    const { name, price, image, description, isAvailable, category, brand } = req.body;

    let imageUrl = image;
    let imagePublicId = null;

    // Upload to Cloudinary if configured and image is base64
    if (image && isValidBase64Image(image)) {
      try {
        const uploadResult = await uploadToCloudinary(image, 'printers');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      } catch (uploadError) {
        console.error('Cloudinary upload failed, using base64:', uploadError.message);
        // Continue with base64 image if Cloudinary fails
      }
    }

    const printer = await Printer.create({
      name,
      price,
      image: imageUrl,
      imagePublicId,
      description,
      isAvailable,
      category,
      brand
    });

    successResponse(res, 201, 'Printer created successfully', printer);
  } catch (error) {
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
      // Delete old image from Cloudinary if exists
      if (printer.imagePublicId) {
        try {
          await deleteFromCloudinary(printer.imagePublicId);
        } catch (error) {
          console.error('Failed to delete old image:', error.message);
        }
      }

      // Upload new image
      if (isValidBase64Image(image)) {
        try {
          const uploadResult = await uploadToCloudinary(image, 'printers');
          updateData.image = uploadResult.url;
          updateData.imagePublicId = uploadResult.publicId;
        } catch (uploadError) {
          console.error('Cloudinary upload failed, using base64:', uploadError.message);
          updateData.image = image;
          updateData.imagePublicId = null;
        }
      } else {
        updateData.image = image;
        updateData.imagePublicId = null;
      }
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

    // Delete image from Cloudinary if exists
    if (printer.imagePublicId) {
      try {
        await deleteFromCloudinary(printer.imagePublicId);
      } catch (error) {
        console.error('Failed to delete image:', error.message);
      }
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

/**
 * @desc    Get printer statistics
 * @route   GET /api/printers/stats
 * @access  Private (Admin)
 */
exports.getPrinterStats = async (req, res, next) => {
  try {
    const total = await Printer.countDocuments();
    const available = await Printer.countDocuments({ isAvailable: true });
    const soldOut = await Printer.countDocuments({ isAvailable: false });
    
    const totalViews = await Printer.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const categoryStats = await Printer.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    successResponse(res, 200, 'Statistics retrieved successfully', {
      total,
      available,
      soldOut,
      totalViews: totalViews.length > 0 ? totalViews[0].totalViews : 0,
      categoryStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;