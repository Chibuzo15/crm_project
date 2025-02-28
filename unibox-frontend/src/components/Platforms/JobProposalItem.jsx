import React from "react";
import { useSelector } from "react-redux";
import { useSyncUpworkJobProposalMutation } from "../../store/api";

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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow ${
        proposal.isSynced ? "border-green-200" : "border-gray-200"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold truncate">{proposal.title}</h3>
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
          {proposal.description || "No description available"}
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
            <span>Posted: {formatDate(proposal.datePosted)}</span>
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span>Candidates: {proposal.candidatesCount || 0}</span>
          </div>
        </div>
      </div>

      {proposal.isSynced && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Synced on: {formatDate(proposal.syncedAt)}
          </span>

          <a
            href={`/chats?jobPostingId=${proposal.syncedJobPostingId}`}
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
          </a>
        </div>
      )}
    </div>
  );
};

export default JobProposalItem;
