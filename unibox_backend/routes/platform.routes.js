const express = require("express");
const router = express.Router();
const platformController = require("../controllers/platform.controller");
const { checkAdmin } = require("../middleware/auth.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");

// @route   GET /api/platforms
// @desc    Get all platforms
// @access  Private
router.get("/", authenticateJWT, platformController.getAllPlatforms);

// @route   GET /api/platforms/:id
// @desc    Get a platform by ID
// @access  Private
router.get("/:id", authenticateJWT, platformController.getPlatformById);

// @route   POST /api/platforms
// @desc    Create a new platform
// @access  Private/Admin
router.post(
  "/",
  authenticateJWT,
  checkAdmin,
  platformController.createPlatform
);

// @route   PUT /api/platforms/:id
// @desc    Update a platform
// @access  Private/Admin
router.put(
  "/:id",
  authenticateJWT,
  checkAdmin,
  platformController.updatePlatform
);

// @route   DELETE /api/platforms/:id
// @desc    Delete a platform
// @access  Private/Admin
router.delete(
  "/:id",
  authenticateJWT,
  checkAdmin,
  platformController.deletePlatform
);

// @route   GET /api/platforms/:id/accounts
// @desc    Get accounts for a platform
// @access  Private
router.get(
  "/:id/accounts",
  authenticateJWT,
  platformController.getPlatformAccounts
);

module.exports = router;
