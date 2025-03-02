// File: routes/message.routes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { handleUpload } = require("../middleware/upload");
const { validateMessage } = require("../middleware/validators");
const { authenticateJWT } = require("../middleware/auth.middleware");

// @route   GET /api/chats/:chatId/messages
// @desc    Get messages for a chat
// @access  Private
router.get(
  "/chats/:chatId/messages",
  authenticateJWT,
  messageController.getMessages
);

// @route   POST /api/chats/:chatId/messages
// @desc    Send a new message
// @access  Private
router.post(
  "/chats/:chatId/messages",
  authenticateJWT,
  handleUpload("attachments", 5),
  validateMessage,
  messageController.sendMessage
);

// @route   PUT /api/messages/:id
// @desc    Update a message (mark as read)
// @access  Private
router.put("/messages/:id", authenticateJWT, messageController.updateMessage);

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete(
  "/messages/:id",
  authenticateJWT,
  messageController.deleteMessage
);

// @route   POST /api/messages/:id/attachments
// @desc    Add attachment to an existing message
// @access  Private
router.post(
  "/messages/:id/attachments",
  authenticateJWT,
  handleUpload("attachments", 5),
  messageController.addAttachments
);

module.exports = router;
