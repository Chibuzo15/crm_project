// File: src/components/JobManagement/JobTypeSelector.jsx
import React, { useState } from "react";
import JobTypeForm from "./JobTypeForm";
import "./JobTypeSelector.css";

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
    <div className="job-type-selector">
      <div className="job-types-list">
        {jobTypes.map((jobType) => (
          <div
            key={jobType._id}
            className={`job-type-item ${
              selectedJobType?._id === jobType._id ? "selected" : ""
            }`}
            onClick={() => handleJobTypeClick(jobType)}
          >
            <h4>{jobType.title}</h4>
            {jobType.description && (
              <p className="job-type-description">{jobType.description}</p>
            )}
          </div>
        ))}

        <div className="add-job-type" onClick={handleAddNew}>
          <span>+ Add New Job Type</span>
        </div>
      </div>

      {showNewForm && (
        <div className="new-job-type-modal">
          <div className="modal-content">
            <h3>Add New Job Type</h3>
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
