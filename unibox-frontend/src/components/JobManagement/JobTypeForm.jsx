import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateJobTypeMutation,
  useUpdateJobTypeMutation,
  useGetJobTypeByIdQuery,
} from "../../store/api";
import {
  setJobTypeFormData,
  resetJobTypeForm,
  setJobTypeFormErrors,
} from "../../store/jobTypeSlice";

const JobTypeForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const {
    jobTypeFormData,
    jobTypeFormMode,
    selectedJobTypeId,
    jobTypeFormErrors,
  } = useSelector((state) => state.jobType);

  const [validationErrors, setValidationErrors] = useState({});

  // Create and update mutations
  const [createJobType, { isLoading: isCreating }] = useCreateJobTypeMutation();
  const [updateJobType, { isLoading: isUpdating }] = useUpdateJobTypeMutation();

  // Get job type data if in edit mode
  const { data: jobTypeData, isLoading: isFetchingJobType } =
    useGetJobTypeByIdQuery(selectedJobTypeId, {
      skip: jobTypeFormMode !== "edit" || !selectedJobTypeId,
    });

  // Set form data from job type data when in edit mode
  useEffect(() => {
    if (jobTypeFormMode === "edit" && jobTypeData) {
      dispatch(
        setJobTypeFormData({
          title: jobTypeData.title || "",
          description: jobTypeData.description || "",
        })
      );
    }
  }, [jobTypeData, jobTypeFormMode, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      setJobTypeFormData({
        ...jobTypeFormData,
        [name]: value,
      })
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!jobTypeFormData.title.trim()) {
      errors.title = "Title is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setJobTypeFormErrors(null));

    if (!validateForm()) {
      return;
    }

    try {
      if (jobTypeFormMode === "create") {
        await createJobType(jobTypeFormData).unwrap();
      } else {
        await updateJobType({
          id: selectedJobTypeId,
          jobTypeData: jobTypeFormData,
        }).unwrap();
      }

      dispatch(resetJobTypeForm());
      if (onCancel) onCancel();
    } catch (err) {
      dispatch(
        setJobTypeFormErrors(err.data?.message || "Failed to save job type")
      );
      console.error("Error saving job type:", err);
    }
  };

  const isLoading = isCreating || isUpdating || isFetchingJobType;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {jobTypeFormMode === "create" ? "Add New Job Type" : "Edit Job Type"}
        </h2>
      </div>

      {jobTypeFormErrors && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {jobTypeFormErrors}
        </div>
      )}

      {isFetchingJobType ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={jobTypeFormData.title}
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

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={jobTypeFormData.description}
              onChange={handleChange}
              disabled={isLoading}
              className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
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
                  {jobTypeFormMode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : jobTypeFormMode === "create" ? (
                "Create Job Type"
              ) : (
                "Update Job Type"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JobTypeForm;
