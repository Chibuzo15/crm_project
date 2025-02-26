import React, { useState } from "react";
import JobTypeForm from "./JobTypeForm";

const JobTypeSelector = ({ jobTypes, selectedJobType, onSelect }) => {
  const [showNewForm, setShowNewForm] = useState(false);

  const handleJobTypeClick = (jobType) => {
    onSelect(jobType);
  };

  const handleAddNew = () => {
    setShowNewForm(true);
  };

  const handleFormCancel = () => {
    setShowNewForm(false);
  };

  const handleFormSubmit = (newJobType) => {
    // This would typically dispatch an action to add the job type
    console.log("New job type:", newJobType);
    setShowNewForm(false);

    // After saving, we would ideally receive the new job type with an ID
    // and then select it
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobTypes.map((jobType) => (
          <div
            key={jobType._id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedJobType?._id === jobType._id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
            }`}
            onClick={() => handleJobTypeClick(jobType)}
          >
            <h4 className="font-medium text-gray-900">{jobType.title}</h4>
            {jobType.description && (
              <p className="mt-1 text-sm text-gray-600">
                {jobType.description}
              </p>
            )}
          </div>
        ))}

        <div
          className="p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center"
          onClick={handleAddNew}
        >
          <span className="text-blue-500 font-medium">+ Add New Job Type</span>
        </div>
      </div>

      {showNewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Job Type
            </h3>
            <JobTypeForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTypeSelector;
