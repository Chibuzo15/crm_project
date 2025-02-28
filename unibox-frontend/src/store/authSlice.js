import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    error: null,
    loginFormData: {
      email: "",
      password: "",
    },
    registerFormData: {
      name: "",
      email: "",
      password: "",
      role: "hr",
    },
  },
  reducers: {
    // Reducers for form state management
    setLoginFormData: (state, action) => {
      state.loginFormData = action.payload;
    },
    setRegisterFormData: (state, action) => {
      state.registerFormData = action.payload;
    },
    resetLoginForm: (state) => {
      state.loginFormData = {
        email: "",
        password: "",
      };
    },
    resetRegisterForm: (state) => {
      state.registerFormData = {
        name: "",
        email: "",
        password: "",
        role: "user",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login success
      .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
        // Store token in localStorage
        localStorage.setItem("token", payload.token);

        state.token = payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // If user data is included in response
        if (payload.user) {
          state.user = payload.user;
        }
      })
      // Handle login error
      .addMatcher(api.endpoints.login.matchRejected, (state, { payload }) => {
        state.error = payload?.data?.message || "Login failed";
        state.isAuthenticated = false;
      })
      // Handle register success
      .addMatcher(
        api.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          // If registration automatically logs in the user
          if (payload.token) {
            localStorage.setItem("token", payload.token);
            state.token = payload.token;
            state.isAuthenticated = true;

            if (payload.user) {
              state.user = payload.user;
            }
          }

          state.error = null;
        }
      )
      // Handle register error
      .addMatcher(
        api.endpoints.register.matchRejected,
        (state, { payload }) => {
          state.error = payload?.data?.message || "Registration failed";
        }
      )
      // Handle get current user success
      .addMatcher(
        api.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      // Handle get current user error
      .addMatcher(
        api.endpoints.getCurrentUser.matchRejected,
        (state, { payload }) => {
          // Only change authentication state if token is invalid
          if (payload?.status === 401) {
            localStorage.removeItem("token");
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
          }

          state.error = payload?.data?.message || "Authentication failed";
        }
      );
  },
});

export const {
  setLoginFormData,
  setRegisterFormData,
  resetLoginForm,
  resetRegisterForm,
  clearError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
