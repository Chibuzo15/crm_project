import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

// Create a slice to maintain UI state related to platforms
// The actual API calls are handled by RTK Query in api.js
const platformSlice = createSlice({
  name: "platforms",
  initialState: {
    currentPlatform: null,
    selectedPlatformId: null,
    platformFormData: {
      name: "",
      type: "job-posting", // 'job-posting' or 'scouting'
      supportsAttachments: true,
      apiEndpoint: "",
    },
    platformFormErrors: null,
    platformFormMode: "create", // 'create' or 'edit'
  },
  reducers: {
    setCurrentPlatform: (state, action) => {
      state.currentPlatform = action.payload;
    },
    setSelectedPlatformId: (state, action) => {
      state.selectedPlatformId = action.payload;
    },
    setPlatformFormData: (state, action) => {
      state.platformFormData = action.payload;
    },
    resetPlatformForm: (state) => {
      state.platformFormData = {
        name: "",
        type: "job-posting",
        supportsAttachments: true,
        apiEndpoint: "",
      };
      state.platformFormErrors = null;
    },
    setPlatformFormMode: (state, action) => {
      state.platformFormMode = action.payload;
    },
    setPlatformFormErrors: (state, action) => {
      state.platformFormErrors = action.payload;
    },
    preparePlatformFormForEdit: (state, action) => {
      const platform = action.payload;
      state.platformFormData = {
        name: platform.name,
        type: platform.type,
        supportsAttachments: platform.supportsAttachments,
        apiEndpoint: platform.apiEndpoint || "",
      };
      state.platformFormMode = "edit";
      state.selectedPlatformId = platform._id;
    },
  },
  // Add any extra reducers to handle RTK Query actions if needed
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getPlatformById.matchFulfilled,
      (state, { payload }) => {
        if (state.selectedPlatformId === payload._id) {
          // Update current selected platform when fetched
          state.currentPlatform = payload;
        }
      }
    );
  },
});

export const {
  setCurrentPlatform,
  setSelectedPlatformId,
  setPlatformFormData,
  resetPlatformForm,
  setPlatformFormMode,
  setPlatformFormErrors,
  preparePlatformFormForEdit,
} = platformSlice.actions;

export default platformSlice.reducer;
