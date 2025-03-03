import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

// Create a slice to maintain UI state related to users
// The actual API calls are handled by RTK Query in api.js
const userSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    selectedUserId: null,
    userFormData: {
      name: "",
      email: "",
      role: "user",
      maxResponseTime: 8,
    },
    userFormErrors: null,
    userFormMode: "create", // 'create' or 'edit'
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
    setUserFormData: (state, action) => {
      state.userFormData = action.payload;
    },
    resetUserForm: (state) => {
      state.userFormData = {
        name: "",
        email: "",
        role: "user",
        maxResponseTime: 8,
      };
      state.userFormErrors = null;
    },
    setUserFormMode: (state, action) => {
      state.userFormMode = action.payload;
    },
    setUserFormErrors: (state, action) => {
      state.userFormErrors = action.payload;
    },
    prepareUserFormForEdit: (state, action) => {
      const user = action.payload;
      state.userFormData = {
        name: user.name,
        email: user.email,
        role: user.role,
        maxResponseTime: user.maxResponseTime || 8,
      };
      state.userFormMode = "edit";
      state.selectedUserId = user._id;
    },
  },
  // Add any extra reducers to handle RTK Query actions if needed
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getUserById.matchFulfilled,
      (state, { payload }) => {
        if (state.selectedUserId === payload._id) {
          // Update current selected user when fetched
          state.currentUser = payload;
        }
      }
    );
  },
});

export const {
  setCurrentUser,
  setSelectedUserId,
  setUserFormData,
  resetUserForm,
  setUserFormMode,
  setUserFormErrors,
  prepareUserFormForEdit,
} = userSlice.actions;

export default userSlice.reducer;
