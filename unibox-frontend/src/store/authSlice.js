import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Set auth token in axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Check if user is authenticated
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("No token found");
      }

      setAuthToken(token);

      const res = await axios.get("/api/auth/me");
      return res.data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed"
      );
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", credentials);

      // Set token in localStorage and axios headers
      setAuthToken(res.data.token);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/api/auth/logout");

      // Remove token
      setAuthToken(null);

      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const initialState = {
  token: getToken(),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check authentication status
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = null;
    });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
