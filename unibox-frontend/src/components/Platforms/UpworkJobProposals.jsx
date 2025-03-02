import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUpworkJobProposalsQuery,
  useGetPlatformAccountsQuery,
  useSyncUpworkJobProposalMutation,
  useGetPlatformsQuery,
  useGetChatsQuery,
} from "../../store/api";
import { setUpworkProposalsFilter } from "../../store/jobPostingSlice";
import JobProposalItem from "./JobProposalItem";

const UpworkJobProposals = () => {
  const dispatch = useDispatch();
  const { upworkProposalsFilter } = useSelector((state) => state.jobPosting);

  const { data: platforms, isLoading: platformsLoading } = useGetPlatformsQuery(
    {}
  );

  const UpworkPlatformId = React.useMemo(() => {
    if (!platforms?.[0]) return;
    let upworkPlatformObj = platforms?.find(
      (platform) => platform?.name?.toLowerCase() == "upwork"
    );

    return upworkPlatformObj?._id;
  }, [platforms]);

  // Replace useEffect/useSelector with RTK Query hooks
  const {
    data: accounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useGetPlatformAccountsQuery({
    platform: UpworkPlatformId,
  });

  // Get proposals with RTK Query
  const {
    data: proposals,
    isLoading: proposalsLoading,
    refetch: refetchProposals,
    error: proposalsError,
  } = useGetUpworkJobProposalsQuery(
    upworkProposalsFilter.accountId
      ? { accountId: upworkProposalsFilter.accountId }
      : {},
    { skip: !upworkProposalsFilter.accountId }
  );

  // Add a reference to the chat refetch function
  const { refetch: refetchChats } = useGetChatsQuery(
    {}, // Empty filter to match the pattern used in Unibox
    { skip: false } // Don't skip so we have access to refetch
  );

  // Sync mutation
  const [syncProposal, { isLoading: isSyncing }] =
    useSyncUpworkJobProposalMutation();

  const handleAccountChange = (e) => {
    const accountId = e.target.value;
    dispatch(setUpworkProposalsFilter({ accountId }));
  };

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    dispatch(setUpworkProposalsFilter({ status }));
  };

  const handleSyncSuccess = (chatId) => {
    // Refetch chats when a sync succeeds
    refetchChats();
  };

  const handleSyncAll = async () => {
    if (!proposals || !upworkProposalsFilter.accountId) return;

    try {
      for (const proposal of proposals) {
        if (!proposal.isSynced) {
          await syncProposal({
            accountId: upworkProposalsFilter.accountId,
            proposalId: proposal.id,
          }).unwrap();

          // Mark that at least one sync occurred
          syncedAny = true;
        }
      }

      // If any proposals were synced, refetch the proposals and chats
      if (syncedAny) {
        handleSyncSuccess();
      }
    } catch (err) {
      console.error("Failed to sync all proposals:", err);
    }
  };

  // Filter proposals based on status filter
  const filteredProposals = proposals
    ? proposals.filter((proposal) => {
        if (upworkProposalsFilter.status === "all") return true;
        if (upworkProposalsFilter.status === "synced") return proposal.isSynced;
        if (upworkProposalsFilter.status === "pending")
          return !proposal.isSynced;
        return true;
      })
    : [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upwork Job Proposals</h2>

        <div className="flex items-center space-x-4">
          <div>
            <select
              value={upworkProposalsFilter.accountId || ""}
              onChange={handleAccountChange}
              className="px-3 py-2 border border-gray-300 rounded"
              disabled={accountsLoading}
            >
              <option value="">Select Account</option>
              {accounts &&
                accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.username}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <select
              value={upworkProposalsFilter.status || "all"}
              onChange={handleStatusFilterChange}
              className="px-3 py-2 border border-gray-300 rounded"
              disabled={!upworkProposalsFilter.accountId}
            >
              <option value="all">All Proposals</option>
              <option value="pending">Pending Sync</option>
              <option value="synced">Synced</option>
            </select>
          </div>

          <button
            onClick={handleSyncAll}
            disabled={
              isSyncing ||
              proposalsLoading ||
              !proposals ||
              proposals.length === 0
            }
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center ${
              isSyncing ||
              proposalsLoading ||
              !proposals ||
              proposals.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSyncing ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
            )}
            Sync All
          </button>
        </div>
      </div>

      {accountsLoading && (
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {accountsError && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Error loading Upwork accounts:{" "}
          {accountsError.message || "Unknown error"}
        </div>
      )}

      {!upworkProposalsFilter.accountId && !accountsLoading && !accountsError && (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-gray-600">
            Select an Upwork account to view job proposals
          </p>
        </div>
      )}

      {upworkProposalsFilter.accountId && proposalsLoading && (
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {upworkProposalsFilter.accountId && proposalsError && (
        <div className="p-4 bg-red-100 text-red-700 rounded flex justify-between items-center">
          <span>
            Error loading proposals: {proposalsError.message || "Unknown error"}
          </span>
          <button
            onClick={refetchProposals}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {upworkProposalsFilter.accountId &&
        !proposalsLoading &&
        !proposalsError &&
        filteredProposals.length === 0 && (
          <div className="p-6 bg-gray-50 rounded-lg text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              ></path>
            </svg>
            <p className="text-gray-600">
              No job proposals found for this account
            </p>
          </div>
        )}

      {upworkProposalsFilter.accountId &&
        !proposalsLoading &&
        !proposalsError &&
        filteredProposals.length > 0 && (
          <div className="grid grid-cols-1  gap-4 mt-4">
            {filteredProposals.map((proposal) => (
              <JobProposalItem
                key={proposal.id}
                proposal={proposal}
                onSyncSuccess={handleSyncSuccess}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default UpworkJobProposals;
