const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'clrlgldl',
  api_key: process.env.CLOUDINARY_API_KEY || '123634466868278',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'k9D9nsrkhISNipkcFRQ3D5cuXaE'
});

module.exports = cloudinary;
