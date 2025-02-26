import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch messages for a chat
export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}/messages`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

// Send a message
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ chatId, content, attachments = [] }, { rejectWithValue }) => {
    try {
      // Create FormData for attachments
      const formData = new FormData();
      formData.append("content", content);

      // Add attachments if any
      if (attachments.length > 0) {
        attachments.forEach((attachment) => {
          if (attachment.file) {
            formData.append("attachments", attachment.file);
          }
        });
      }

      const response = await axios.post(
        `/api/chats/${chatId}/messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

// Mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  "message/markMessagesAsRead",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/chats/${chatId}/messages/read`);
      return { chatId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read"
      );
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  sending: false,
  error: null,
  sendError: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessageFromSocket: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
      state.sendError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.sending = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.sendError = action.payload;
      });

    // Mark messages as read
    builder.addCase(markMessagesAsRead.fulfilled, (state, action) => {
      // Update unread status of messages
      state.messages.forEach((message) => {
        if (!message.isFromUs && !message.isRead) {
          message.isRead = true;
        }
      });
    });
  },
});

export const { addMessageFromSocket, clearMessages, clearError } =
  messageSlice.actions;

export default messageSlice.reducer;
