const multer = require('multer');
const path = require('path');

// Set up multer to store files in a temporary directory
const upload = multer({
  dest: path.join(__dirname, '..', 'temp'), // Temporary directory
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
}).single('file');

module.exports = upload;
