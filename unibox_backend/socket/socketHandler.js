// File: socket/socketHandler.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const UserActivity = require("../models/UserActivity");
const mongoose = require("mongoose");

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      // Get token from socket handshake query
      const token = socket.handshake.query?.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Attach user to socket
      socket.user = user;

      // Update user's last active time
      user.lastActive = Date.now();
      await user.save();

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);

    // Join user to a room with their user ID
    // This allows targeting specific users for notifications
    socket.join(socket.user._id.toString());

    // Track active chats for this user
    const activeChats = new Set();

    // Join chat room
    socket.on("join_chat", async (chatId) => {
      try {
        // Validate chatId
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
          socket.emit("error", { message: "Invalid chat ID" });
          return;
        }

        // Check if chat exists
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        // Join the chat room
        socket.join(chatId);
        activeChats.add(chatId);

        console.log(`User ${socket.user.name} joined chat: ${chatId}`);

        // Mark messages as read when joining a chat
        await Message.updateMany(
          {
            chat: chatId,
            isFromUs: false,
            isRead: false,
          },
          { isRead: true }
        );

        // Update chat unread count
        await Chat.findByIdAndUpdate(chatId, { unreadCount: 0 });

        // Notify client that messages are marked as read
        socket.emit("messages_read", { chatId });
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("error", { message: "Error joining chat" });
      }
    });

    // Leave chat room
    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId);
      activeChats.delete(chatId);
      console.log(`User ${socket.user.name} left chat: ${chatId}`);
    });

    // Send message
    socket.on("send_message", async (messageData) => {
      try {
        const { chat: chatId, content, attachments = [] } = messageData;

        // Validate required fields
        if (!chatId || !content) {
          socket.emit("error", { message: "Chat ID and content are required" });
          return;
        }

        // Check if chat exists
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        // Create message
        const message = new Message({
          chat: chatId,
          sender: socket.user._id,
          content,
          isFromUs: true,
          attachments,
          isRead: true,
        });

        await message.save();

        // Populate sender for the response
        const populatedMessage = await Message.findById(message._id).populate(
          "sender",
          "name"
        );

        // Emit message to all users in the chat room
        io.to(chatId).emit("new_message", populatedMessage);

        // Track user activity
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if response is on time (based on followUpDate)
        const isOnTime = !chat.followUpDate || new Date() <= chat.followUpDate;

        // Find or create user activity record for today
        let activity = await UserActivity.findOne({
          user: socket.user._id,
          date: today,
        });

        if (!activity) {
          activity = new UserActivity({
            user: socket.user._id,
            date: today,
            messagesOnTime: 0,
            messagesOffTime: 0,
            totalMessages: 0,
            chatsInteracted: [],
          });
        }

        // Update activity counters
        if (isOnTime) {
          activity.messagesOnTime += 1;
        } else {
          activity.messagesOffTime += 1;
        }

        activity.totalMessages += 1;

        // Add chat to interacted chats if not already present
        if (!activity.chatsInteracted.includes(chatId)) {
          activity.chatsInteracted.push(chatId);
        }

        await activity.save();

        console.log(`Message sent by ${socket.user.name} in chat: ${chatId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Error sending message" });
      }
    });

    // Handle external message (from platform API)
    // This would be called by a platform webhook handler
    socket.on("external_message", async (data) => {
      try {
        const {
          chatId,
          content,
          attachments = [],
          externalId,
          platform,
          candidateUsername,
        } = data;

        // If chat ID is provided, add message to existing chat
        if (chatId) {
          // Create message
          const message = new Message({
            chat: chatId,
            content,
            isFromUs: false,
            attachments,
            externalId,
            isRead: false,
          });

          await message.save();

          // Increment unread count for the chat
          await Chat.findByIdAndUpdate(chatId, {
            $inc: { unreadCount: 1 },
            lastMessageDate: new Date(),
          });

          // Emit message to all users in the chat room
          io.to(chatId).emit("new_message", message);

          // Also notify all connected admin users
          const admins = await User.find({ role: "admin" });
          admins.forEach((admin) => {
            io.to(admin._id.toString()).emit("chat_notification", {
              type: "new_message",
              chatId,
              message,
            });
          });
        }
        // If no chat ID but platform and username are provided, create or find chat
        else if (platform && candidateUsername) {
          // Find platform ID
          const platformDoc = await Platform.findOne({ name: platform });

          if (!platformDoc) {
            socket.emit("error", { message: "Platform not found" });
            return;
          }

          // Find existing chat
          let chat = await Chat.findOne({
            platform: platformDoc._id,
            candidateUsername,
          });

          // If no chat exists, create one
          if (!chat) {
            // Find a platform account to associate
            const account = await PlatformAccount.findOne({
              platform: platformDoc._id,
              active: true,
            });

            if (!account) {
              socket.emit("error", {
                message: "No active account for this platform",
              });
              return;
            }

            chat = new Chat({
              platform: platformDoc._id,
              platformAccount: account._id,
              candidateUsername,
              status: "active",
              followUpInterval: 2, // Default value
            });

            await chat.save();
          }

          // Create message in the chat
          const message = new Message({
            chat: chat._id,
            content,
            isFromUs: false,
            attachments,
            externalId,
            isRead: false,
          });

          await message.save();

          // Increment unread count for the chat
          await Chat.findByIdAndUpdate(chat._id, {
            $inc: { unreadCount: 1 },
            lastMessageDate: new Date(),
          });

          // Notify all connected users about the new chat/message
          io.emit("new_chat", {
            chat,
            message,
          });
        } else {
          socket.emit("error", { message: "Invalid external message data" });
        }
      } catch (error) {
        console.error("Error handling external message:", error);
        socket.emit("error", { message: "Error handling external message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", (chatId) => {
      // Broadcast to all users in the chat except the sender
      socket.to(chatId).emit("typing", {
        chatId,
        user: {
          _id: socket.user._id,
          name: socket.user.name,
        },
      });
    });

    // Handle stop typing indicator
    socket.on("stop_typing", (chatId) => {
      socket.to(chatId).emit("stop_typing", {
        chatId,
        user: {
          _id: socket.user._id,
          name: socket.user.name,
        },
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name}`);

      // Leave all active chat rooms
      activeChats.forEach((chatId) => {
        socket.leave(chatId);
      });
    });
  });
};

module.exports = socketHandler;
