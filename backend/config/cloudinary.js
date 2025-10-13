const cloudinary = require('cloudinary').v2;
const { cloudinary: cloudinaryConfig } = require('./env');

// Configure cloudinary
if (cloudinaryConfig.cloudName && cloudinaryConfig.apiKey && cloudinaryConfig.apiSecret) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret
  });
  console.log('Cloudinary configured successfully');
} else {
  console.log('Cloudinary not configured - using local storage');
}

module.exports = cloudinary;