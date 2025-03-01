import { io } from "socket.io-client";
import {
  JOIN_CHAT,
  JOIN_USER_CHANNEL,
  LEAVE_CHAT,
  SEND_MESSAGE,
  SOCKET_CONNECT,
  SOCKET_CONNECT_ERROR,
  SOCKET_DISCONNECT,
  STOP_TYPING,
  TYPING,
} from "./socketEvents";

// Get the API URL from environment variables or use a default
const API_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Create socket instance but don't connect immediately
let socket = io(API_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  query: { token: "" },
});

// Add authentication data when connecting
const updateSocketAuth = (token) => {
  // Disconnect if already connected
  if (socket.connected) {
    socket.disconnect();
  }

  // Update auth data
  socket.auth = { token };
};

// Handle common socket events
socket.on(SOCKET_CONNECT, () => {
  console.log("Socket connected");
});

socket.on(SOCKET_CONNECT_ERROR, (err) => {
  console.error("Socket connection error:", err);
});

socket.on(SOCKET_DISCONNECT, (reason) => {
  console.log("Socket disconnected:", reason);
});

// Utility to emit events with error handling
const emitEvent = (event, data) => {
  return new Promise((resolve, reject) => {
    if (!socket.connected) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit(event, data, (response) => {
      if (response && response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });
};

export default {
  // Socket instance
  socket,

  // Connection methods
  connect: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },
  disconnect: () => socket.disconnect(),

  // Set authentication token
  setToken: (token) => {
    updateSocketAuth(token);
  },

  // Check connection status
  isConnected: () => socket.connected,

  // Event handlers
  on: (event, handler) => socket.on(event, handler),
  off: (event, handler) => socket.off(event, handler),

  // Emit events (raw and with promise)
  emit: (event, data) => socket.emit(event, data),
  emitWithAck: (event, data) => emitEvent(event, data),

  // Chat room methods
  joinChat: (roomId) => socket.emit(JOIN_CHAT, roomId),
  leaveChat: (roomId) => socket.emit(LEAVE_CHAT, roomId),

  // Chat specific methods
  sendMessage: (message) => socket.emit(SEND_MESSAGE, message),
  startTyping: (data) => socket.emit(TYPING, data),
  stopTyping: (data) => socket.emit(STOP_TYPING, data),

  // User-specific methods
  joinUserChannel: (userId) => socket.emit(JOIN_USER_CHANNEL, { userId }),
};
