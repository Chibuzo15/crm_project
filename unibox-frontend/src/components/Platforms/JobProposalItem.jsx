import React from "react";
import { useSelector } from "react-redux";
import { useSyncUpworkJobProposalMutation } from "../../store/api";

import moment from "moment";
import { Link } from "react-router-dom";

const JobProposalItem = ({ proposal }) => {
  const { upworkProposalsFilter } = useSelector((state) => state.jobPosting);

  // Replace dispatch(syncUpworkJobProposal()) with RTK Query mutation
  const [syncProposal, { isLoading: isSyncing }] =
    useSyncUpworkJobProposalMutation();

  const handleSync = async () => {
    if (!proposal || !upworkProposalsFilter.accountId) return;

    try {
      await syncProposal({
        accountId: upworkProposalsFilter.accountId,
        proposalId: proposal.id,
      }).unwrap();
    } catch (err) {
      console.error("Failed to sync proposal:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).fromNow();
  };

  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow ${
        proposal.isSynced ? "border-green-200" : "border-gray-200"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold truncate">
            {proposal.jobTitle}
          </h3>
          {proposal.isSynced ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              Synced
            </span>
          ) : (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700 ${
                isSyncing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSyncing ? "Syncing..." : "Sync Now"}
            </button>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-600 line-clamp-2">
          {proposal.proposal || "No proposal available"}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span>Posted: {formatDate(proposal.date)}</span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span>Candidate: {proposal.candidateName}</span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              ></path>
            </svg>
            <span>Job Type: {proposal.jobType}</span>
          </div>
        </div>
      </div>

      {proposal.isSynced && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Synced on: {formatDate(proposal.syncedAt)}
          </span>

          <Link
            href={`/unibox?jobPostingId=${proposal.jobPostingId}`}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            View Chats
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobProposalItem;
