
const multer = require('multer');
const path = require('path');

// Specify the storage destination and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'C:/Users/aspire/OneDrive/Bureau/myshopy/photo'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  // Set up multer with the storage configuration
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set the file size limit (in bytes)
    fileFilter: function (req, file, cb) {
      // Validate file types
      const allowedFileTypes = /jpeg|jpg|png/;
      const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedFileTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, or PNG files are allowed.'));
      }
    },
  });

  
module.exports = upload;