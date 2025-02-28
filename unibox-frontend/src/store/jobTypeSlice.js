import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

// Create a slice to maintain UI state related to job types
// The actual API calls are handled by RTK Query in api.js
const jobTypeSlice = createSlice({
  name: "jobTypes",
  initialState: {
    currentJobType: null,
    selectedJobTypeId: null,
    jobTypeFormData: {
      title: "",
      description: "",
    },
    jobTypeFormErrors: null,
    jobTypeFormMode: "create", // 'create' or 'edit'
  },
  reducers: {
    setCurrentJobType: (state, action) => {
      state.currentJobType = action.payload;
    },
    setSelectedJobTypeId: (state, action) => {
      state.selectedJobTypeId = action.payload;
    },
    setJobTypeFormData: (state, action) => {
      state.jobTypeFormData = action.payload;
    },
    resetJobTypeForm: (state) => {
      state.jobTypeFormData = {
        title: "",
        description: "",
      };
      state.jobTypeFormErrors = null;
    },
    setJobTypeFormMode: (state, action) => {
      state.jobTypeFormMode = action.payload;
    },
    setJobTypeFormErrors: (state, action) => {
      state.jobTypeFormErrors = action.payload;
    },
    prepareJobTypeFormForEdit: (state, action) => {
      const jobType = action.payload;
      state.jobTypeFormData = {
        title: jobType.title,
        description: jobType.description || "",
      };
      state.jobTypeFormMode = "edit";
      state.selectedJobTypeId = jobType._id;
    },
  },
  // Add any extra reducers to handle RTK Query actions if needed
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getJobTypeById.matchFulfilled,
      (state, { payload }) => {
        if (state.selectedJobTypeId === payload._id) {
          // Update current selected job type when fetched
          state.currentJobType = payload;
        }
      }
    );
  },
});

export const {
  setCurrentJobType,
  setSelectedJobTypeId,
  setJobTypeFormData,
  resetJobTypeForm,
  setJobTypeFormMode,
  setJobTypeFormErrors,
  prepareJobTypeFormForEdit,
} = jobTypeSlice.actions;

export default jobTypeSlice.reducer;
