import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";
import messageReducer from "./messageSlice";
import jobTypeReducer from "./jobTypeSlice";
import platformReducer from "./platformSlice";
import accountReducer from "./accountSlice";
import jobPostingReducer from "./jobPostingSlice";
import upworkReducer from "./upworkSlice";
import userReducer from "./userSlice";
import analyticsReducer from "./analyticsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    message: messageReducer,
    jobType: jobTypeReducer,
    platform: platformReducer,
    account: accountReducer,
    jobPosting: jobPostingReducer,
    upwork: upworkReducer,
    user: userReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["chat/updateChat/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["chat.currentChat.followUpDate"],
      },
    }),
});

export default store;
