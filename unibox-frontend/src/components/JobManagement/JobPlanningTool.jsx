import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useGetJobPostingsQuery,
  useDeleteJobPostingMutation,
  useUpdateJobPostingStatusMutation,
  useGetJobTypesQuery,
} from "../../store/api";
import {
  prepareJobPostingFormForEdit,
  setJobPostingFormMode,
} from "../../store/jobPostingSlice";
import JobPostingPlatform from "./JobPostingPlatform";
import ActionPlanningSection from "./ActionPlanningSection";

const JobPlanningTool = () => {
  const dispatch = useDispatch();
  const [selectedJobTypeId, setSelectedJobTypeId] = useState("");
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showJobPostingForm, setShowJobPostingForm] = useState(false);
  const [editingJobPostingId, setEditingJobPostingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobPostingToDelete, setJobPostingToDelete] = useState(null);

  // Fetch job types for filter dropdown
  const { data: jobTypes } = useGetJobTypesQuery();

  // Build filter params for job postings query
  const filterParams = {};
  if (selectedJobTypeId) filterParams.jobTypeId = selectedJobTypeId;
  if (selectedPlatformId) filterParams.platformId = selectedPlatformId;
  if (selectedStatus) filterParams.status = selectedStatus;

  // Fetch job postings with filters
  const {
    data: jobPostings,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetJobPostingsQuery(filterParams);

  // Mutations for job posting operations
  const [deleteJobPosting, { isLoading: isDeleting }] =
    useDeleteJobPostingMutation();
  const [updateJobPostingStatus, { isLoading: isUpdatingStatus }] =
    useUpdateJobPostingStatusMutation();

  const handleJobTypeFilterChange = (e) => {
    setSelectedJobTypeId(e.target.value);
  };

  const handlePlatformFilterChange = (e) => {
    setSelectedPlatformId(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleAddJobPosting = () => {
    setEditingJobPostingId(null);
    setShowJobPostingForm(true);
  };

  const handleEditJobPosting = (jobPosting) => {
    dispatch(prepareJobPostingFormForEdit(jobPosting));
    dispatch(setJobPostingFormMode("edit"));
    setEditingJobPostingId(jobPosting._id);
    setShowJobPostingForm(true);
  };

  const handleJobPostingSave = () => {
    setShowJobPostingForm(false);
    setEditingJobPostingId(null);
    refetch();
  };

  const handleCancelJobPosting = () => {
    setShowJobPostingForm(false);
    setEditingJobPostingId(null);
  };

  const handleDeleteClick = (jobPosting) => {
    setJobPostingToDelete(jobPosting);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (jobPostingToDelete) {
      try {
        await deleteJobPosting(jobPostingToDelete._id).unwrap();
        setShowDeleteModal(false);
        setJobPostingToDelete(null);
      } catch (err) {
        console.error("Failed to delete job posting:", err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setJobPostingToDelete(null);
  };

  const handleStatusToggle = async (jobPosting) => {
    try {
      const newStatus = jobPosting.status === "active" ? "paused" : "active";
      await updateJobPostingStatus({
        id: jobPosting._id,
        status: newStatus,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update job posting status:", err);
    }
  };

  // Helper for platform name lookup
  const getPlatformName = (jobPosting) => {
    return jobPosting.platform?.name || "Unknown Platform";
  };

  // Helper for job type name lookup
  const getJobTypeName = (jobPosting) => {
    return jobPosting.jobType?.title || "Unknown Job Type";
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (showJobPostingForm) {
    return (
      <div className="p-4">
        <JobPostingPlatform
          jobPostingId={editingJobPostingId}
          onSave={handleJobPostingSave}
          onCancel={handleCancelJobPosting}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Job Planning Tool</h2>
        <p className="text-sm text-gray-500 mt-1">
          Plan and manage job postings across different platforms
        </p>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="font-medium mb-3">Job Postings</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label
              htmlFor="jobTypeFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Type
            </label>
            <select
              id="jobTypeFilter"
              value={selectedJobTypeId}
              onChange={handleJobTypeFilterChange}
              className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Job Types</option>
              {jobTypes &&
                jobTypes.map((jobType) => (
                  <option key={jobType._id} value={jobType._id}>
                    {jobType.title}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="platformFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Platform
            </label>
            <select
              id="platformFilter"
              value={selectedPlatformId}
              onChange={handlePlatformFilterChange}
              className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Platforms</option>
              <option value="upwork">Upwork</option>
              <option value="fiverr">Fiverr</option>
              <option value="behance">Behance</option>
              <option value="pinterest">Pinterest</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={handleStatusFilterChange}
              className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archive</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddJobPosting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add Job Posting
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-100 text-red-700 rounded flex justify-between items-center">
            <span>
              Error loading job postings: {error?.message || "Unknown error"}
            </span>
            <button
              onClick={refetch}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (!jobPostings || jobPostings.length === 0) && (
          <div className="p-6 bg-gray-50 rounded-lg text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <p className="text-gray-600">
              No job postings found with the selected filters.
            </p>
          </div>
        )}

        {!isLoading && !isError && jobPostings && jobPostings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Platform
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Posted
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Recurring
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobPostings.map((jobPosting) => (
                  <tr key={jobPosting._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {jobPosting.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getJobTypeName(jobPosting)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getPlatformName(jobPosting)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(jobPosting.datePosted)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(jobPosting)}
                        disabled={isUpdatingStatus}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          jobPosting.status === "published"
                            ? "bg-green-100 text-green-800"
                            : jobPosting.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {jobPosting.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {jobPosting.isRecurring ? (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-500 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          Every {jobPosting.recurringDays} days
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-400 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditJobPosting(jobPosting)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(jobPosting)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ActionPlanningSection />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete the job posting "
              {jobPostingToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPlanningTool;
