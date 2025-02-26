import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch user performance metrics
export const fetchUserActivity = createAsyncThunk(
  "analytics/fetchUserActivity",
  async ({ startDate, endDate, userId }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (userId) queryParams.append("userId", userId);

      const url = userId
        ? `/api/users/${userId}/activity?${queryParams.toString()}`
        : `/api/analytics/user-performance?${queryParams.toString()}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user activity"
      );
    }
  }
);

// Fetch job statistics
export const fetchJobStats = createAsyncThunk(
  "analytics/fetchJobStats",
  async ({ startDate, endDate, jobType }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (jobType) queryParams.append("jobType", jobType);

      const response = await axios.get(
        `/api/analytics/job-stats?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job statistics"
      );
    }
  }
);

// Fetch platform statistics
export const fetchPlatformStats = createAsyncThunk(
  "analytics/fetchPlatformStats",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const response = await axios.get(
        `/api/analytics/platform-stats?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch platform statistics"
      );
    }
  }
);

// Fetch daily activity metrics
export const fetchDailyActivity = createAsyncThunk(
  "analytics/fetchDailyActivity",
  async ({ startDate, endDate, userId }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (userId) queryParams.append("userId", userId);

      const response = await axios.get(
        `/api/analytics/daily-activity?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch daily activity"
      );
    }
  }
);

const initialState = {
  userActivity: [],
  jobStats: [],
  platformStats: [],
  dailyResults: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsData: (state) => {
      state.userActivity = [];
      state.jobStats = [];
      state.platformStats = [];
      state.dailyResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // User activity
    builder
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.userActivity = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Job stats
    builder
      .addCase(fetchJobStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobStats.fulfilled, (state, action) => {
        state.jobStats = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Platform stats
    builder
      .addCase(fetchPlatformStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformStats.fulfilled, (state, action) => {
        state.platformStats = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlatformStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Daily activity
    builder
      .addCase(fetchDailyActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyActivity.fulfilled, (state, action) => {
        state.dailyResults = action.payload;
        state.loading = false;
      })
      .addCase(fetchDailyActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalyticsData, clearError } = analyticsSlice.actions;

export default analyticsSlice.reducer;
