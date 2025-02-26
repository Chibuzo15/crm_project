// File: routes/message.routes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const upload = require("../middleware/upload");
const { validateMessage } = require("../middleware/validators");

// @route   GET /api/chats/:chatId/messages
// @desc    Get messages for a chat
// @access  Private
router.get("/chats/:chatId/messages", messageController.getMessages);

// @route   POST /api/chats/:chatId/messages
// @desc    Send a new message
// @access  Private
router.post(
  "/chats/:chatId/messages",
  validateMessage,
  upload.array("attachments", 5),
  messageController.sendMessage
);

// @route   PUT /api/messages/:id
// @desc    Update a message (mark as read)
// @access  Private
router.put("/messages/:id", messageController.updateMessage);

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete("/messages/:id", messageController.deleteMessage);

// @route   POST /api/messages/:id/attachments
// @desc    Add attachment to a message
// @access  Private
router.post(
  "/messages/:id/attachments",
  upload.array("attachments", 5),
  messageController.addAttachments
);

module.exports = router;
