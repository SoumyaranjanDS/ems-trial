const cloudinary = require('../config/cloudinary');

// @desc    Upload image file to Cloudinary
// @route   POST /api/upload
// @access  Public / Protected
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file' });
    }

    // Convert memory buffer to stream and upload to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'eventhub/banners',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]:', error);
          return res.status(500).json({ success: false, message: 'Cloudinary upload failed', error: error.message });
        }
        res.status(200).json({
          success: true,
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};
