import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch Upwork jobs
export const fetchUpworkJobs = createAsyncThunk(
  "upwork/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/platforms/upwork/jobs");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Upwork jobs"
      );
    }
  }
);

// Update Upwork job status
export const updateUpworkJobStatus = createAsyncThunk(
  "upwork/updateJobStatus",
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/platforms/upwork/jobs/${jobId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job status"
      );
    }
  }
);

// Fetch candidates for a job
export const fetchUpworkCandidates = createAsyncThunk(
  "upwork/fetchCandidates",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/platforms/upwork/jobs/${jobId}/candidates`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch candidates"
      );
    }
  }
);

const initialState = {
  jobs: [],
  candidates: [],
  loading: false,
  error: null,
  candidatesLoading: false,
  candidatesError: null,
};

const upworkSlice = createSlice({
  name: "upwork",
  initialState,
  reducers: {
    clearUpworkData: (state) => {
      state.jobs = [];
      state.candidates = [];
    },
    clearError: (state) => {
      state.error = null;
      state.candidatesError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch jobs
    builder
      .addCase(fetchUpworkJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpworkJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.loading = false;
      })
      .addCase(fetchUpworkJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update job status
    builder.addCase(updateUpworkJobStatus.fulfilled, (state, action) => {
      const index = state.jobs.findIndex(
        (job) => job._id === action.payload._id
      );
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    });

    // Fetch candidates
    builder
      .addCase(fetchUpworkCandidates.pending, (state) => {
        state.candidatesLoading = true;
        state.candidatesError = null;
      })
      .addCase(fetchUpworkCandidates.fulfilled, (state, action) => {
        state.candidates = action.payload;
        state.candidatesLoading = false;
      })
      .addCase(fetchUpworkCandidates.rejected, (state, action) => {
        state.candidatesLoading = false;
        state.candidatesError = action.payload;
      });
  },
});

export const { clearUpworkData, clearError } = upworkSlice.actions;

export default upworkSlice.reducer;
