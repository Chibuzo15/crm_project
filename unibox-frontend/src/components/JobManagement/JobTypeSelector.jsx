import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useGetJobTypesQuery, useDeleteJobTypeMutation } from "../../store/api";
import {
  setCurrentJobType,
  prepareJobTypeFormForEdit,
  setJobTypeFormMode,
} from "../../store/jobTypeSlice";

const JobTypeSelector = ({ onAddJobType, onEditJobType }) => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobTypeToDelete, setJobTypeToDelete] = useState(null);

  // Get job types with RTK Query
  const {
    data: jobTypes,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetJobTypesQuery();

  // Delete job type mutation
  const [deleteJobType, { isLoading: isDeleting }] = useDeleteJobTypeMutation();

  const handleSelectJobType = (jobType) => {
    dispatch(setCurrentJobType(jobType));
  };

  const handleAddClick = () => {
    if (onAddJobType) onAddJobType();
  };

  const handleEditClick = (jobType) => {
    dispatch(prepareJobTypeFormForEdit(jobType));
    dispatch(setJobTypeFormMode("edit"));

    if (onEditJobType) onEditJobType(jobType);
  };

  const handleDeleteClick = (jobType) => {
    setJobTypeToDelete(jobType);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (jobTypeToDelete) {
      try {
        await deleteJobType(jobTypeToDelete._id).unwrap();
        setShowDeleteModal(false);
        setJobTypeToDelete(null);
      } catch (err) {
        console.error("Failed to delete job type:", err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setJobTypeToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded flex justify-between items-center">
        <span>
          Error loading job types: {error?.message || "Unknown error"}
        </span>
        <button
          onClick={refetch}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Job Types</h2>
        <button
          onClick={handleAddClick}
          className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
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
          Add Job Type
        </button>
      </div>

      <div className="p-2">
        {jobTypes && jobTypes.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {jobTypes.map((jobType) => (
              <li
                key={jobType._id}
                className="p-2 hover:bg-gray-50 flex justify-between items-center"
              >
                <button
                  onClick={() => handleSelectJobType(jobType)}
                  className="flex-1 flex items-center text-left p-2 hover:bg-gray-100 rounded"
                >
                  <span className="font-medium">{jobType.title}</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(jobType)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Edit Job Type"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(jobType)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete Job Type"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No job types found. Add your first job type to get started.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete the job type "
              {jobTypeToDelete?.title}"? This action cannot be undone.
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

export default JobTypeSelector;
