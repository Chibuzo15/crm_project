import { io } from "socket.io-client";

// Get the API URL from environment variables or use a default
const API_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Create socket instance but don't connect immediately
let socket = io(API_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
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
socket.on("connect", () => {
  console.log("Socket connected");
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
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
  joinRoom: (roomId) => socket.emit("join_room", roomId),
  leaveRoom: (roomId) => socket.emit("leave_room", roomId),

  // Chat specific methods
  sendMessage: (message) => socket.emit("send_message", message),
  startTyping: (data) => socket.emit("typing", data),
  stopTyping: (data) => socket.emit("stop_typing", data),

  // User-specific methods
  joinUserChannel: (userId) => socket.emit("join", { userId }),
};
