import React, { useState, useEffect, useRef } from "react";
import {
  useGetJobTypesQuery,
  useGetPlatformsQuery,
  useGetPlatformAccountsQuery,
  useGetJobPostingsQuery,
} from "../../store/api";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Filters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterRef = useRef(null);

  // Use RTK Query hooks instead of useSelector
  const { data: jobTypes = [] } = useGetJobTypesQuery();
  const { data: platforms = [] } = useGetPlatformsQuery();
  const { data: platformAccounts = [] } = useGetPlatformAccountsQuery({});
  const { data: jobPostings = [] } = useGetJobPostingsQuery({});

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className="filters relative" ref={filterRef}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        <button
          onClick={toggleExpand}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* Expandable filters with animation and overlay */}
      <div
        className={`absolute left-0 right-0 bg-white border-b border-gray-200 shadow-md z-10 transition-all duration-300 ease-in-out  overflow-y-auto
        ${
          isExpanded
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
        style={{
          top: "100%",
          transform: isExpanded ? "translateY(0)" : "translateY(-10px)",
        }}
      >
        <div className="p-4 space-y-3">
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
              {platforms.map((platform) => (
                <option key={platform._id} value={platform._id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Account filter - New */}
          <div>
            <label
              htmlFor="platformAccount-filter"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              Platform Account
            </label>
            <select
              id="platformAccount-filter"
              value={filters.platformAccount}
              onChange={(e) =>
                onFilterChange("platformAccount", e.target.value)
              }
              className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Accounts</option>
              {platformAccounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.username} ({account.platform?.name || "Unknown"})
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
              {jobTypes.map((type) => (
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
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="to archive">To Archive</option>
              {/* <option value="converted">Converted</option> */}
              <option value="working on poc">Working on POC</option>
              <option value="starred">Starred</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Job Posting filter  */}
          <div>
            <label
              htmlFor="jobPosting-filter"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              Job Posting
            </label>
            <select
              id="jobPosting-filter"
              value={filters.jobPosting}
              onChange={(e) => onFilterChange("jobPosting", e.target.value)}
              className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Job Postings</option>
              {jobPostings.map((posting) => (
                <option key={posting._id} value={posting._id}>
                  {posting.title}
                </option>
              ))}
            </select>
          </div>

          {/* Follow-up Date Range filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Follow-up Date Range
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <DatePicker
                  selected={
                    filters.followUpStartDate
                      ? new Date(filters.followUpStartDate)
                      : null
                  }
                  onChange={(date) =>
                    onFilterChange(
                      "followUpStartDate",
                      date ? date.toISOString() : ""
                    )
                  }
                  placeholderText="Start Date"
                  className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  selected={
                    filters.followUpEndDate
                      ? new Date(filters.followUpEndDate)
                      : null
                  }
                  onChange={(date) =>
                    onFilterChange(
                      "followUpEndDate",
                      date ? date.toISOString() : ""
                    )
                  }
                  placeholderText="End Date"
                  className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
          </div>

          {/* Pending Replies filter */}
          <div className="flex items-center">
            <input
              id="pendingReplies-filter"
              type="checkbox"
              checked={filters.pendingReplies === "true"}
              onChange={(e) =>
                onFilterChange(
                  "pendingReplies",
                  e.target.checked ? "true" : "false"
                )
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="pendingReplies-filter"
              className="ml-2 block text-sm text-gray-700"
            >
              Pending Replies
            </label>
          </div>

          {/* Follow Up filter */}
          <div className="flex items-center">
            <input
              id="followup-filter"
              type="checkbox"
              checked={filters.followUp === "true"}
              onChange={(e) =>
                onFilterChange("followUp", e.target.checked ? "true" : "false")
              }
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
      </div>

      {/* Active filters summary */}
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.platform && (
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

        {filters.platformAccount && (
          <div className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {platformAccounts.find((a) => a._id === filters.platformAccount)
              ?.username || "Account"}
            <button
              onClick={() => onFilterChange("platformAccount", "")}
              className="ml-1.5 text-indigo-700 hover:text-indigo-900"
            >
              &times;
            </button>
          </div>
        )}

        {filters.jobType && (
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

        {filters.followUp === "true" && (
          <div className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Needs Follow-up
            <button
              onClick={() => onFilterChange("followUp", "false")}
              className="ml-1.5 text-yellow-700 hover:text-yellow-900"
            >
              &times;
            </button>
          </div>
        )}

        {filters.jobPosting && (
          <div className="inline-flex items-center bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {jobPostings.find((p) => p._id === filters.jobPosting)?.title ||
              "Job Posting"}
            <button
              onClick={() => onFilterChange("jobPosting", "")}
              className="ml-1.5 text-teal-700 hover:text-teal-900"
            >
              &times;
            </button>
          </div>
        )}

        {filters.pendingReplies === "true" && (
          <div className="inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Pending Replies
            <button
              onClick={() => onFilterChange("pendingReplies", "false")}
              className="ml-1.5 text-orange-700 hover:text-orange-900"
            >
              &times;
            </button>
          </div>
        )}

        {(filters.followUpStartDate || filters.followUpEndDate) && (
          <div className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mt-2">
            Follow-up:{" "}
            {filters.followUpStartDate
              ? `From ${new Date(
                  filters.followUpStartDate
                ).toLocaleDateString()}`
              : ""}
            {filters.followUpEndDate
              ? ` To ${new Date(filters.followUpEndDate).toLocaleDateString()}`
              : ""}
            <button
              onClick={() => {
                onFilterChange("followUpStartDate", "");
                onFilterChange("followUpEndDate", "");
              }}
              className="ml-1.5 text-green-700 hover:text-green-900"
            >
              &times;
            </button>
          </div>
        )}

        {(filters.platform ||
          filters.platformAccount ||
          filters.jobType ||
          filters.status ||
          filters.followUpStartDate ||
          filters.followUpEndDate ||
          filters.followUp === "true" ||
          filters.jobPosting ||
          filters.pendingReplies === "true") && (
          <button
            onClick={() => {
              onFilterChange("platform", "");
              onFilterChange("platformAccount", "");
              onFilterChange("jobType", "");
              onFilterChange("status", "");
              onFilterChange("followUp", "false");
              onFilterChange("followUpStartDate", "");
              onFilterChange("followUpEndDate", "");
              onFilterChange("jobPosting", "");
              onFilterChange("pendingReplies", "false");
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
