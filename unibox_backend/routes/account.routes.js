const express = require("express");
const router = express.Router();
const platformAccountController = require("../controllers/platformAccount.controller");
const { authenticateJWT } = require("../middleware/auth.middleware");

// @route   GET /api/accounts
// @desc    Get all platform accounts
// @access  Private
router.get("/", authenticateJWT, platformAccountController.getAllAccounts);

// @route   GET /api/accounts/:id
// @desc    Get a platform account by ID
// @access  Private
router.get("/:id", authenticateJWT, platformAccountController.getAccountById);

// @route   POST /api/accounts
// @desc    Create a new platform account
// @access  Private
router.post("/", authenticateJWT, platformAccountController.createAccount);

// @route   PUT /api/accounts/:id
// @desc    Update a platform account
// @access  Private
router.put("/:id", authenticateJWT, platformAccountController.updateAccount);

// @route   DELETE /api/accounts/:id
// @desc    Delete a platform account
// @access  Private
router.delete("/:id", authenticateJWT, platformAccountController.deleteAccount);

// @route   PUT /api/accounts/:id/last-sync
// @desc    Update last sync time for an account
// @access  Private
router.put(
  "/:id/last-sync",
  authenticateJWT,
  platformAccountController.updateLastSync
);

// @route   POST /api/accounts/:id/sync
// @desc    Sync account with external platform
// @access  Private
router.post(
  "/:id/sync",
  authenticateJWT,
  platformAccountController.syncAccount
);

module.exports = router;
