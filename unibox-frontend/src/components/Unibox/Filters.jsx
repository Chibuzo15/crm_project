import React, { useState } from "react";
import { useSelector } from "react-redux";

const Filters = ({ filters, onFilterChange }) => {
  const { platforms } = useSelector((state) => state.platform);
  const { jobTypes } = useSelector((state) => state.jobType);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="filters">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        <button
          onClick={toggleExpand}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className={`space-y-3 ${isExpanded ? "block" : "hidden"}`}>
        {/* Platform filter */}
        <div>
          <label
            htmlFor="platform-filter"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Platform
          </label>
          <select
            id="platform-filter"
            value={filters.platform}
            onChange={(e) => onFilterChange("platform", e.target.value)}
            className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Platforms</option>
            {platforms?.map((platform) => (
              <option key={platform._id} value={platform._id}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type filter */}
        <div>
          <label
            htmlFor="jobType-filter"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Job Type
          </label>
          <select
            id="jobType-filter"
            value={filters.jobType}
            onChange={(e) => onFilterChange("jobType", e.target.value)}
            className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Job Types</option>
            {jobTypes?.map((type) => (
              <option key={type._id} value={type._id}>
                {type.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label
            htmlFor="status-filter"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="to archive">To Archive</option>
            <option value="working on poc">Working on POC</option>
            <option value="starred">Starred</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Follow Up filter */}
        <div className="flex items-center">
          <input
            id="followup-filter"
            type="checkbox"
            checked={filters.followUp}
            onChange={(e) => onFilterChange("followUp", e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="followup-filter"
            className="ml-2 block text-sm text-gray-700"
          >
            Show requiring follow-up
          </label>
        </div>
      </div>

      {/* Active filters summary */}
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.platform && platforms && (
          <div className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {platforms.find((p) => p._id === filters.platform)?.name ||
              "Platform"}
            <button
              onClick={() => onFilterChange("platform", "")}
              className="ml-1.5 text-blue-700 hover:text-blue-900"
            >
              &times;
            </button>
          </div>
        )}

        {filters.jobType && jobTypes && (
          <div className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {jobTypes.find((t) => t._id === filters.jobType)?.title ||
              "Job Type"}
            <button
              onClick={() => onFilterChange("jobType", "")}
              className="ml-1.5 text-green-700 hover:text-green-900"
            >
              &times;
            </button>
          </div>
        )}

        {filters.status && (
          <div className="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {filters.status}
            <button
              onClick={() => onFilterChange("status", "")}
              className="ml-1.5 text-purple-700 hover:text-purple-900"
            >
              &times;
            </button>
          </div>
        )}

        {filters.followUp && (
          <div className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Needs Follow-up
            <button
              onClick={() => onFilterChange("followUp", false)}
              className="ml-1.5 text-yellow-700 hover:text-yellow-900"
            >
              &times;
            </button>
          </div>
        )}

        {(filters.platform ||
          filters.jobType ||
          filters.status ||
          filters.followUp) && (
          <button
            onClick={() => {
              onFilterChange("platform", "");
              onFilterChange("jobType", "");
              onFilterChange("status", "");
              onFilterChange("followUp", false);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline ml-1"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
