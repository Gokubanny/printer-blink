const mongoose = require('mongoose');

const printerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Printer name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  imagePublicId: {
    type: String, // Cloudinary public ID for deletion
    default: null
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['inkjet', 'laser', 'all-in-one', 'photo', 'other'],
    default: 'other'
  },
  brand: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for search optimization
printerSchema.index({ name: 'text', description: 'text' });
printerSchema.index({ isAvailable: 1 });
printerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Printer', printerSchema);