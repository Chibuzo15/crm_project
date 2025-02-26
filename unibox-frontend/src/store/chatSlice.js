import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch chats
export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query string
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.platform) queryParams.append("platform", filters.platform);
      if (filters.jobType) queryParams.append("jobType", filters.jobType);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.followUp) queryParams.append("followUp", filters.followUp);
      if (filters.jobPosting)
        queryParams.append("jobPosting", filters.jobPosting);

      const response = await axios.get(`/api/chats?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chats"
      );
    }
  }
);

// Fetch chat by ID
export const fetchChatById = createAsyncThunk(
  "chat/fetchChatById",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chat"
      );
    }
  }
);

// Update chat
export const updateChat = createAsyncThunk(
  "chat/updateChat",
  async ({ chatId, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/chats/${chatId}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update chat"
      );
    }
  }
);

// Update chat status
export const updateChatStatus = createAsyncThunk(
  "chat/updateChatStatus",
  async ({ chatId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/chats/${chatId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update chat status"
      );
    }
  }
);

// Update chat job type
export const updateChatJobType = createAsyncThunk(
  "chat/updateChatJobType",
  async ({ chatId, jobType }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/chats/${chatId}/job-type`, {
        jobType,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update chat job type"
      );
    }
  }
);

// Update follow-up interval
export const updateFollowUpInterval = createAsyncThunk(
  "chat/updateFollowUpInterval",
  async ({ chatId, followUpInterval }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/chats/${chatId}/follow-up`, {
        followUpInterval,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update follow-up interval"
      );
    }
  }
);

// Update chat notes
export const updateChatNotes = createAsyncThunk(
  "chat/updateChatNotes",
  async ({ chatId, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/chats/${chatId}/notes`, { notes });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update chat notes"
      );
    }
  }
);

const initialState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = null;
    },
    updateChatLastMessage: (state, action) => {
      const { chatId, message } = action.payload;

      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId);

      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message.content;
        state.chats[chatIndex].lastMessageDate = message.createdAt;

        // Increment unread count if message is not from us
        if (!message.isFromUs) {
          state.chats[chatIndex].unreadCount =
            (state.chats[chatIndex].unreadCount || 0) + 1;
        }
      }
    },
    addMessage: (state, action) => {
      // Update current chat last message date if it's the same chat
      if (state.currentChat && state.currentChat._id === action.payload.chat) {
        state.currentChat.lastMessageDate = action.payload.createdAt;
      }
    },
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch chats
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch chat by ID
    builder
      .addCase(fetchChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.currentChat = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update chat
    builder
      .addCase(updateChat.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateChat.fulfilled, (state, action) => {
        // Update chat in the list
        const index = state.chats.findIndex(
          (chat) => chat._id === action.payload._id
        );
        if (index !== -1) {
          state.chats[index] = action.payload;
        }

        // Update current chat if it's the one being updated
        if (state.currentChat && state.currentChat._id === action.payload._id) {
          state.currentChat = action.payload;
        }

        state.updating = false;
      })
      .addCase(updateChat.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });

    // Update chat status
    builder.addCase(updateChatStatus.fulfilled, (state, action) => {
      // Update chat in the list
      const index = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      );
      if (index !== -1) {
        state.chats[index].status = action.payload.status;
      }

      // Update current chat if it's the one being updated
      if (state.currentChat && state.currentChat._id === action.payload._id) {
        state.currentChat.status = action.payload.status;
      }
    });

    // Update chat job type
    builder.addCase(updateChatJobType.fulfilled, (state, action) => {
      // Update chat in the list
      const index = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      );
      if (index !== -1) {
        state.chats[index].jobType = action.payload.jobType;
      }

      // Update current chat if it's the one being updated
      if (state.currentChat && state.currentChat._id === action.payload._id) {
        state.currentChat.jobType = action.payload.jobType;
      }
    });

    // Update follow-up interval
    builder.addCase(updateFollowUpInterval.fulfilled, (state, action) => {
      // Update chat in the list
      const index = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      );
      if (index !== -1) {
        state.chats[index].followUpInterval = action.payload.followUpInterval;
        state.chats[index].followUpDate = action.payload.followUpDate;
      }

      // Update current chat if it's the one being updated
      if (state.currentChat && state.currentChat._id === action.payload._id) {
        state.currentChat.followUpInterval = action.payload.followUpInterval;
        state.currentChat.followUpDate = action.payload.followUpDate;
      }
    });

    // Update chat notes
    builder.addCase(updateChatNotes.fulfilled, (state, action) => {
      // Update chat in the list
      const index = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      );
      if (index !== -1) {
        state.chats[index].notes = action.payload.notes;
      }

      // Update current chat if it's the one being updated
      if (state.currentChat && state.currentChat._id === action.payload._id) {
        state.currentChat.notes = action.payload.notes;
      }
    });
  },
});

export const {
  setCurrentChat,
  clearCurrentChat,
  updateChatLastMessage,
  addMessage,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
