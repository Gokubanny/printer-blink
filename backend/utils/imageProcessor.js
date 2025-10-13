const cloudinary = require('../config/cloudinary');

/**
 * Upload image to Cloudinary
 * @param {String} base64Image - Base64 encoded image string
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Returns secure_url and public_id
 */
exports.uploadToCloudinary = async (base64Image, folder = 'printhub') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto'
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<Object>}
 */
exports.deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

/**
 * Convert buffer to base64
 * @param {Buffer} buffer - Image buffer
 * @returns {String} - Base64 string
 */
exports.bufferToBase64 = (buffer) => {
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};

/**
 * Validate base64 image string
 * @param {String} base64String - Base64 image string
 * @returns {Boolean}
 */
exports.isValidBase64Image = (base64String) => {
  const regex = /^data:image\/(png|jpeg|jpg|webp);base64,/;
  return regex.test(base64String);
};

module.exports = exports;