import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";

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
  const daysSincePosted = job.datePosted
    ? differenceInDays(new Date(), new Date(job.datePosted))
    : 0;

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "archived":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
            <span>
              Posted: {format(new Date(job.datePosted), "MMM d, yyyy")}
            </span>
            <span>•</span>
            <span>
              {daysSincePosted} {daysSincePosted === 1 ? "day" : "days"} ago
            </span>
            <span>•</span>
            <span>
              {candidateCount}{" "}
              {candidateCount === 1 ? "candidate" : "candidates"}
            </span>
          </div>

          <p className="mt-3 text-gray-600">
            {job.description.length > 200
              ? job.description.substring(0, 200) + "..."
              : job.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <button
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => onViewCandidates(job._id)}
          >
            View Candidates
          </button>

          <div className="relative">
            <button
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-between min-w-[120px] ${getStatusColor(
                job.status
              )}`}
              onClick={toggleDropdown}
            >
              <span>{job.status}</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStatusChange("active")}
                  >
                    Active
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStatusChange("paused")}
                  >
                    Paused
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStatusChange("closed")}
                  >
                    Closed
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStatusChange("archived")}
                  >
                    Archived
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobProposalItem;
