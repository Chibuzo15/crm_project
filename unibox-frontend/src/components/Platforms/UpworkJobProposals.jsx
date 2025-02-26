// File: src/components/Platforms/UpworkJobProposals.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUpworkJobs,
  updateUpworkJobStatus,
} from "../../redux/actions/upworkActions";
import { useNavigate } from "react-router-dom";
import JobProposalItem from "./JobProposalItem";
import "./UpworkJobProposals.css";

const UpworkJobProposals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state) => state.upwork);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUpworkJobs());
  }, [dispatch]);

  const handleStatusChange = (jobId, newStatus) => {
    dispatch(updateUpworkJobStatus(jobId, newStatus));
  };

  const handleViewCandidates = (jobId) => {
    navigate(`/unibox?jobPosting=${jobId}`);
  };

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

  return (
    <div className="upwork-job-proposals">
      <h2>Upwork Job Proposals</h2>

      <div className="job-filters">
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`filter-button ${filter === "closed" ? "active" : ""}`}
          onClick={() => setFilter("closed")}
        >
          Closed
        </button>
        <button
          className={`filter-button ${filter === "archived" ? "active" : ""}`}
          onClick={() => setFilter("archived")}
        >
          Archived
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading job proposals...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredJobs.length === 0 ? (
        <div className="no-jobs-message">
          <p>No job proposals found</p>
        </div>
      ) : (
        <div className="job-list">
          {filteredJobs.map((job) => (
            <JobProposalItem
              key={job._id}
              job={job}
              onStatusChange={handleStatusChange}
              onViewCandidates={handleViewCandidates}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpworkJobProposals;
