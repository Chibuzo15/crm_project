// File: middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// List of allowed file types
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-rar-compressed",
  "text/plain",
];

// File filter function to validate file types
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not allowed. Allowed types: ${allowedTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`
      ),
      false
    );
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Create a custom middleware to handle multer errors
const handleUpload = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              error: true,
              message: `File too large. Maximum size is 10MB.`,
            });
          } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
              error: true,
              message: `Too many files uploaded. Maximum is ${maxCount}.`,
            });
          } else {
            return res.status(400).json({
              error: true,
              message: `Upload error: ${err.message}`,
            });
          }
        } else {
          // An unknown error occurred
          return res.status(400).json({
            error: true,
            message: err.message || "Unknown error during file upload.",
          });
        }
      }
      // If no error, continue to the next middleware
      next();
    });
  };
};

module.exports = {
  upload,
  handleUpload,
  allowedTypes,
};
