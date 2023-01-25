const multer = require("multer");
const path = require("path");

// Set the storage engine
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialise healthcare institution profile upload
const HiUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("HiUpload"); // Must be the name as the HTML file upload input

// Initialise business profile upload
const bUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("bUpload"); // Must be the name as the HTML file upload input

// Initialise migrant profile upload
const mUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("mUpload"); // Must be the name as the HTML file upload input

// Check File Type
function checkFileType(file, callback) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Test extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Test mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return callback(null, true);
  } else {
    callback({ message: "Images Only" });
  }
}

module.exports = {
  HiUpload: HiUpload,
  bUpload: bUpload,
  mUpload: mUpload,
};