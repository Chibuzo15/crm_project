import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUpworkJobs,
  updateUpworkJobStatus,
} from "../../store/upworkSlice";
import { useNavigate } from "react-router-dom";
import JobProposalItem from "./JobProposalItem";

const UpworkJobProposals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state) => state.upwork);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUpworkJobs());
  }, [dispatch]);

  const handleStatusChange = (jobId, newStatus) => {
    dispatch(updateUpworkJobStatus({ jobId, status: newStatus }));
  };

  const handleViewCandidates = (jobId) => {
    navigate(`/unibox?jobPosting=${jobId}`);
  };

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Upwork Job Proposals
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "closed"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("closed")}
          >
            Closed
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "archived"
                ? "bg-gray-300 text-gray-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("archived")}
          >
            Archived
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300"
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
          <p className="mt-4 text-gray-500">No job proposals found</p>
        </div>
      ) : (
        <div className="space-y-4">
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
