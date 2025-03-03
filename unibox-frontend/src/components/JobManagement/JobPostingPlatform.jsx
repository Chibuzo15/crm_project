import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetPlatformsQuery,
  useGetPlatformAccountsQuery,
  useGetJobTypesQuery,
  useCreateJobPostingMutation,
  useUpdateJobPostingMutation,
  useGetJobPostingByIdQuery,
} from "../../store/api";
import {
  setJobPostingFormData,
  resetJobPostingForm,
  setJobPostingFormErrors,
} from "../../store/jobPostingSlice";

const JobPostingPlatform = ({ jobPostingId, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const { jobPostingFormData, jobPostingFormErrors } = useSelector(
    (state) => state.jobPosting
  );
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPlatformId, setSelectedPlatformId] = useState("");

  // Get platforms for dropdown
  const { data: platforms, isLoading: platformsLoading } =
    useGetPlatformsQuery();

  // Get job types for dropdown
  const { data: jobTypes, isLoading: jobTypesLoading } = useGetJobTypesQuery();

  // Get accounts for the selected platform
  const { data: accounts, isLoading: accountsLoading } =
    useGetPlatformAccountsQuery(
      selectedPlatformId ? { platformId: selectedPlatformId } : {},
      { skip: !selectedPlatformId }
    );

  // Get job posting data if editing
  const { data: jobPostingData, isLoading: jobPostingLoading } =
    useGetJobPostingByIdQuery(jobPostingId, { skip: !jobPostingId });

  // Create and update mutations
  const [createJobPosting, { isLoading: isCreating }] =
    useCreateJobPostingMutation();
  const [updateJobPosting, { isLoading: isUpdating }] =
    useUpdateJobPostingMutation();

  // Set form data from job posting data when editing
  useEffect(() => {
    if (jobPostingId && jobPostingData) {
      dispatch(
        setJobPostingFormData({
          title: jobPostingData.title || "",
          description: jobPostingData.description || "",
          jobTypeId:
            jobPostingData.jobType?._id || jobPostingData.jobTypeId || "",
          platformId:
            jobPostingData.platform?._id || jobPostingData.platformId || "",
          platformAccountId:
            jobPostingData.platformAccount?._id ||
            jobPostingData.platformAccountId ||
            "",
          status: jobPostingData.status || "active",
          isRecurring: jobPostingData.isRecurring || false,
          recurringDays: jobPostingData.recurringDays || 7,
        })
      );

      // Set selected platform for accounts filtering
      if (jobPostingData.platform?._id || jobPostingData.platformId) {
        setSelectedPlatformId(
          jobPostingData.platform?._id || jobPostingData.platformId
        );
      }
    }
  }, [jobPostingId, jobPostingData, dispatch]);

  // Update selected platform when form platform changes
  useEffect(() => {
    if (
      jobPostingFormData.platformId &&
      jobPostingFormData.platformId !== selectedPlatformId
    ) {
      setSelectedPlatformId(jobPostingFormData.platformId);
    }
  }, [jobPostingFormData.platformId, selectedPlatformId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    dispatch(
      setJobPostingFormData({
        ...jobPostingFormData,
        [name]: newValue,
      })
    );

    // Clear account selection when platform changes
    if (name === "platformId" && value !== jobPostingFormData.platformId) {
      dispatch(
        setJobPostingFormData({
          ...jobPostingFormData,
          platformId: value,
          platformAccountId: "",
        })
      );
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!jobPostingFormData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!jobPostingFormData.jobTypeId) {
      errors.jobTypeId = "Job type is required";
    }

    if (!jobPostingFormData.platformId) {
      errors.platformId = "Platform is required";
    }

    if (!jobPostingFormData.platformAccountId) {
      errors.platformAccountId = "Platform account is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (jobPostingId) {
        await updateJobPosting({
          id: jobPostingId,
          jobPostingData: jobPostingFormData,
        }).unwrap();
      } else {
        await createJobPosting(jobPostingFormData).unwrap();
      }

      dispatch(resetJobPostingForm());
      if (onSave) onSave();
    } catch (err) {
      dispatch(
        setJobPostingFormErrors(
          err.data?.message || "Failed to save job posting"
        )
      );
      console.error("Error saving job posting:", err);
    }
  };

  const isLoading =
    platformsLoading ||
    jobTypesLoading ||
    accountsLoading ||
    jobPostingLoading ||
    isCreating ||
    isUpdating;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {jobPostingId ? "Edit Job Posting" : "Create New Job Posting"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {jobPostingId
            ? "Update the details of this job posting"
            : "Create a new job posting on a specific platform"}
        </p>
      </div>

      {jobPostingFormErrors && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {jobPostingFormErrors}
        </div>
      )}

      {jobPostingLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="jobTypeId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Type
              </label>
              <select
                id="jobTypeId"
                name="jobTypeId"
                value={jobPostingFormData.jobTypeId}
                onChange={handleChange}
                disabled={isLoading}
                className={`block w-full rounded-md border ${
                  validationErrors.jobTypeId
                    ? "border-red-300"
                    : "border-gray-300"
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Job Type</option>
                {jobTypes &&
                  jobTypes.map((jobType) => (
                    <option key={jobType._id} value={jobType._id}>
                      {jobType.title}
                    </option>
                  ))}
              </select>
              {validationErrors.jobTypeId && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.jobTypeId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="platformId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Platform
              </label>
              <select
                id="platformId"
                name="platformId"
                value={jobPostingFormData.platformId}
                onChange={handleChange}
                disabled={isLoading || jobPostingId} // Disable changing platform when editing
                className={`block w-full rounded-md border ${
                  validationErrors.platformId
                    ? "border-red-300"
                    : "border-gray-300"
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Platform</option>
                {platforms &&
                  platforms.map((platform) => (
                    <option key={platform._id} value={platform._id}>
                      {platform.name}
                    </option>
                  ))}
              </select>
              {validationErrors.platformId && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.platformId}
                </p>
              )}
            </div>
          </div>

          {selectedPlatformId && (
            <div>
              <label
                htmlFor="platformAccountId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Platform Account
              </label>
              <select
                id="platformAccountId"
                name="platformAccountId"
                value={jobPostingFormData.platformAccountId}
                onChange={handleChange}
                disabled={
                  isLoading || accountsLoading || !accounts || jobPostingId
                }
                className={`block w-full rounded-md border ${
                  validationErrors.platformAccountId
                    ? "border-red-300"
                    : "border-gray-300"
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Account</option>
                {accounts &&
                  accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.username}
                    </option>
                  ))}
              </select>
              {accountsLoading && (
                <p className="mt-1 text-sm text-gray-500">
                  Loading accounts...
                </p>
              )}
              {validationErrors.platformAccountId && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.platformAccountId}
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={jobPostingFormData.title}
              onChange={handleChange}
              disabled={isLoading}
              className={`block w-full rounded-md border ${
                validationErrors.title ? "border-red-300" : "border-gray-300"
              } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={jobPostingFormData.description}
              onChange={handleChange}
              disabled={isLoading}
              className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={jobPostingFormData.status}
                onChange={handleChange}
                disabled={isLoading}
                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archive</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={jobPostingFormData.isRecurring}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isRecurring"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Recurring Job Posting
                </label>
              </div>
            </div>
          </div>

          {jobPostingFormData.isRecurring && (
            <div>
              <label
                htmlFor="recurringDays"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Recurring Interval (days)
              </label>
              <input
                type="number"
                id="recurringDays"
                name="recurringDays"
                min="1"
                value={jobPostingFormData.recurringDays}
                onChange={handleChange}
                disabled={isLoading}
                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {jobPostingId ? "Updating..." : "Creating..."}
                </>
              ) : jobPostingId ? (
                "Update Job Posting"
              ) : (
                "Create Job Posting"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JobPostingPlatform;
