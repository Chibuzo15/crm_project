// File: routes/chat.routes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const {
  validateChatCreate,
  validateChatUpdate,
} = require("../middleware/validators");

// @route   GET /api/chats
// @desc    Get all chats with filtering
// @access  Private
router.get("/", chatController.getChats);

// @route   GET /api/chats/:id
// @desc    Get a chat by ID
// @access  Private
router.get("/:id", chatController.getChatById);

// @route   POST /api/chats
// @desc    Create a new chat
// @access  Private
router.post("/", validateChatCreate, chatController.createChat);

// @route   PUT /api/chats/:id
// @desc    Update a chat
// @access  Private
router.put("/:id", validateChatUpdate, chatController.updateChat);

// @route   DELETE /api/chats/:id
// @desc    Delete a chat
// @access  Private
router.delete("/:id", chatController.deleteChat);

// @route   GET /api/chats/pending
// @desc    Get chats with pending replies
// @access  Private
router.get("/pending", chatController.getPendingChats);

// @route   PUT /api/chats/:id/status
// @desc    Update chat status
// @access  Private
router.put("/:id/status", chatController.updateChatStatus);

// @route   PUT /api/chats/:id/job-type
// @desc    Assign/update job type for a chat
// @access  Private
router.put("/:id/job-type", chatController.updateChatJobType);

// @route   PUT /api/chats/:id/follow-up
// @desc    Update follow-up interval for a chat
// @access  Private
router.put("/:id/follow-up", chatController.updateFollowUpInterval);

// @route   PUT /api/chats/:id/notes
// @desc    Update notes for a chat
// @access  Private
router.put("/:id/notes", chatController.updateChatNotes);

module.exports = router;
