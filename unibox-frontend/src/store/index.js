import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import the API service
import { api } from "./api";

// Import slices
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";
import messageReducer from "./messageSlice";
import analyticsReducer from "./analyticsSlice";
import upworkReducer from "./upworkSlice";
import userReducer from "./userSlice";
import platformReducer from "./platformSlice";
import jobTypeReducer from "./jobTypeSlice";
import jobPostingReducer from "./jobPostingSlice";

const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    chat: chatReducer,
    message: messageReducer,
    analytics: analyticsReducer,
    upwork: upworkReducer,
    user: userReducer,
    platform: platformReducer,
    jobType: jobTypeReducer,
    jobPosting: jobPostingReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of RTK Query.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
