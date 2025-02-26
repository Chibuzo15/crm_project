// File: src/components/Platforms/JobProposalItem.jsx
import React, { useState } from "react";
import { formatDate } from "../../utils/dateUtils";
import "./JobProposalItem.css";

const JobProposalItem = ({ job, onStatusChange, onViewCandidates }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(job._id, newStatus);
    setShowDropdown(false);
  };

  // Calculate some metrics
  const candidateCount = job.candidates?.length || 0;
  const daysSincePosted = Math.floor(
    (new Date() - new Date(job.datePosted)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="job-proposal-item">
      <div className="job-info">
        <h3 className="job-title">{job.title}</h3>
        <div className="job-meta">
          <span className="job-date">
            Posted: {formatDate(job.datePosted, "MMM d, yyyy")}
          </span>
          <span className="days-ago">{daysSincePosted} days ago</span>
          <span className="candidates-count">{candidateCount} candidates</span>
        </div>

        <p className="job-description">
          {job.description.length > 200
            ? job.description.substring(0, 200) + "..."
            : job.description}
        </p>
      </div>

      <div className="job-actions">
        <button
          className="view-candidates-button"
          onClick={() => onViewCandidates(job._id)}
        >
          View Candidates
        </button>

        <div className="status-dropdown-container">
          <button
            className={`status-button status-${job.status.toLowerCase()}`}
            onClick={toggleDropdown}
          >
            {job.status}
            <span className="dropdown-arrow">▼</span>
          </button>

          {showDropdown && (
            <div className="status-dropdown">
              <div
                className="dropdown-option"
                onClick={() => handleStatusChange("active")}
              >
                Active
              </div>
              <div
                className="dropdown-option"
                onClick={() => handleStatusChange("paused")}
              >
                Paused
              </div>
              <div
                className="dropdown-option"
                onClick={() => handleStatusChange("closed")}
              >
                Closed
              </div>
              <div
                className="dropdown-option"
                onClick={() => handleStatusChange("archived")}
              >
                Archived
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobProposalItem;
