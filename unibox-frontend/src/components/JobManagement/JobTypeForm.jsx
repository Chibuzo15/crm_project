// File: src/components/JobManagement/JobTypeForm.jsx
import React, { useState } from "react";
import "./JobTypeForm.css";

const JobTypeForm = ({ jobType, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(jobType?.title || "");
  const [description, setDescription] = useState(jobType?.description || "");
  const [titleError, setTitleError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    // Submit the job type
    onSubmit({
      ...(jobType || {}),
      title,
      description,
    });
  };

  return (
    <form className="job-type-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError("");
          }}
          className={`form-control ${titleError ? "error" : ""}`}
          placeholder="e.g., Front-end Developer"
        />
        {titleError && <div className="error-message">{titleError}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
          placeholder="Describe this job type..."
          rows={4}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button">
          {jobType ? "Update" : "Create"} Job Type
        </button>
      </div>
    </form>
  );
};

export default JobTypeForm;
