// shared/socketEvents.js

// Connection events
const SOCKET_CONNECT = "connect";
const SOCKET_DISCONNECT = "disconnect";
const SOCKET_ERROR = "error";
const SOCKET_CONNECT_ERROR = "connect_error";

// Chat room events
const JOIN_CHAT = "join_chat";
const LEAVE_CHAT = "leave_chat";
const JOIN_USER_CHANNEL = "join";

// Message events
const SEND_MESSAGE = "send_message";
const NEW_MESSAGE = "new_message";
const EXTERNAL_MESSAGE = "external_message";
const MESSAGES_READ = "messages_read";

// Typing indicators
const TYPING = "typing";
const STOP_TYPING = "stop_typing";

// Notification events
const CHAT_NOTIFICATION = "chat_notification";
const NEW_CHAT = "new_chat";
const CHAT_UPDATED = "chat_updated";

module.exports = {
  // Connection events
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  SOCKET_ERROR,
  SOCKET_CONNECT_ERROR,

  // Chat room events
  JOIN_CHAT,
  LEAVE_CHAT,
  JOIN_USER_CHANNEL,

  // Message events
  SEND_MESSAGE,
  NEW_MESSAGE,
  EXTERNAL_MESSAGE,
  MESSAGES_READ,

  // Typing indicators
  TYPING,
  STOP_TYPING,

  // Notification events
  CHAT_NOTIFICATION,
  NEW_CHAT,
  CHAT_UPDATED,
};
