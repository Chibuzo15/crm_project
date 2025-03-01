// src/utils/socketEvents.js

// Connection events
export const SOCKET_CONNECT = "connect";
export const SOCKET_DISCONNECT = "disconnect";
export const SOCKET_ERROR = "error";
export const SOCKET_CONNECT_ERROR = "connect_error";

// Chat room events
export const JOIN_CHAT = "join_chat";
export const LEAVE_CHAT = "leave_chat";
export const JOIN_USER_CHANNEL = "join";

// Message events
export const SEND_MESSAGE = "send_message";
export const NEW_MESSAGE = "new_message";
export const EXTERNAL_MESSAGE = "external_message";
export const MESSAGES_READ = "messages_read";

// Typing indicators
export const TYPING = "typing";
export const STOP_TYPING = "stop_typing";

// Notification events
export const CHAT_NOTIFICATION = "chat_notification";
export const NEW_CHAT = "new_chat";
export const CHAT_UPDATED = "chat_updated";
