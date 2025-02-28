import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

// Create a slice to maintain UI state related to job postings
// The actual API calls are handled by RTK Query in api.js
const jobPostingSlice = createSlice({
  name: "jobPostings",
  initialState: {
    currentJobPosting: null,
    selectedJobPostingId: null,
    jobPostingFormData: {
      jobTypeId: "",
      platformId: "",
      platformAccountId: "",
      title: "",
      description: "",
      status: "active",
      isRecurring: false,
      recurringDays: 7,
    },
    jobPostingFormErrors: null,
    jobPostingFormMode: "create", // 'create' or 'edit'
    upworkProposalsFilter: {
      accountId: null,
      status: "all", // 'all', 'pending', 'synced'
    },
  },
  reducers: {
    setCurrentJobPosting: (state, action) => {
      state.currentJobPosting = action.payload;
    },
    setSelectedJobPostingId: (state, action) => {
      state.selectedJobPostingId = action.payload;
    },
    setJobPostingFormData: (state, action) => {
      state.jobPostingFormData = {
        ...state.jobPostingFormData,
        ...action.payload,
      };
    },
    resetJobPostingForm: (state) => {
      state.jobPostingFormData = {
        jobTypeId: "",
        platformId: "",
        platformAccountId: "",
        title: "",
        description: "",
        status: "active",
        isRecurring: false,
        recurringDays: 7,
      };
      state.jobPostingFormErrors = null;
    },
    setJobPostingFormMode: (state, action) => {
      state.jobPostingFormMode = action.payload;
    },
    setJobPostingFormErrors: (state, action) => {
      state.jobPostingFormErrors = action.payload;
    },
    prepareJobPostingFormForEdit: (state, action) => {
      const jobPosting = action.payload;
      state.jobPostingFormData = {
        jobTypeId: jobPosting.jobType?._id || jobPosting.jobTypeId || "",
        platformId: jobPosting.platform?._id || jobPosting.platformId || "",
        platformAccountId:
          jobPosting.platformAccount?._id || jobPosting.platformAccountId || "",
        title: jobPosting.title || "",
        description: jobPosting.description || "",
        status: jobPosting.status || "active",
        isRecurring: jobPosting.isRecurring || false,
        recurringDays: jobPosting.recurringDays || 7,
      };
      state.jobPostingFormMode = "edit";
      state.selectedJobPostingId = jobPosting._id;
    },
    setUpworkProposalsFilter: (state, action) => {
      state.upworkProposalsFilter = {
        ...state.upworkProposalsFilter,
        ...action.payload,
      };
    },
  },
  // Add any extra reducers to handle RTK Query actions if needed
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getJobPostingById.matchFulfilled,
      (state, { payload }) => {
        if (state.selectedJobPostingId === payload._id) {
          // Update current selected job posting when fetched
          state.currentJobPosting = payload;
        }
      }
    );
  },
});

export const {
  setCurrentJobPosting,
  setSelectedJobPostingId,
  setJobPostingFormData,
  resetJobPostingForm,
  setJobPostingFormMode,
  setJobPostingFormErrors,
  prepareJobPostingFormForEdit,
  setUpworkProposalsFilter,
} = jobPostingSlice.actions;

export default jobPostingSlice.reducer;
