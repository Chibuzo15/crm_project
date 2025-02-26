// File: middleware/validators.js
const { body, validationResult } = require("express-validator");

// Utility function to check validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation for user login
exports.validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

// Validation for user registration
exports.validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["admin", "user"]).withMessage("Invalid role"),
  body("maxResponseTime")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max response time must be at least 1 hour"),
  handleValidation,
];

// Validation for user creation
exports.validateUserCreate = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["admin", "user"]).withMessage("Invalid role"),
  body("maxResponseTime")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max response time must be at least 1 hour"),
  handleValidation,
];

// Validation for user update
exports.validateUserUpdate = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Please enter a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["admin", "user"]).withMessage("Invalid role"),
  body("maxResponseTime")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max response time must be at least 1 hour"),
  handleValidation,
];

// Validation for chat creation
exports.validateChatCreate = [
  body("platform").notEmpty().withMessage("Platform is required"),
  body("platformAccount")
    .notEmpty()
    .withMessage("Platform account is required"),
  body("candidateUsername")
    .notEmpty()
    .withMessage("Candidate username is required"),
  body("jobType").optional(),
  body("jobPosting").optional(),
  body("candidateName").optional(),
  body("status").optional(),
  body("followUpInterval")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Follow up interval must be at least 1 day"),
  body("notes").optional(),
  handleValidation,
];

// Validation for chat update
exports.validateChatUpdate = [
  body("jobType").optional(),
  body("jobPosting").optional(),
  body("candidateName").optional(),
  body("status").optional(),
  body("followUpInterval")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Follow up interval must be at least 1 day"),
  body("notes").optional(),
  body("followUpDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  handleValidation,
];

// Validation for message
exports.validateMessage = [
  body("content").notEmpty().withMessage("Message content is required"),
  handleValidation,
];

// Validation for job type
exports.validateJobType = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional(),
  handleValidation,
];

// Validation for job posting
exports.validateJobPosting = [
  body("jobType").notEmpty().withMessage("Job type is required"),
  body("platform").notEmpty().withMessage("Platform is required"),
  body("platformAccount")
    .notEmpty()
    .withMessage("Platform account is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("externalId").optional(),
  body("datePosted").optional().isISO8601().withMessage("Invalid date format"),
  body("status")
    .optional()
    .isIn(["draft", "published", "closed", "archived"])
    .withMessage("Invalid status"),
  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean"),
  body("recurringDays")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Recurring days must be at least 1"),
  body("nextRecurringDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  handleValidation,
];
