import React, { useState } from "react";
import {
  useGetPlatformAccountsQuery,
  useDeletePlatformAccountMutation,
  useGetPlatformsQuery,
} from "../../store/api";
import NewAccountButton from "./NewAccountButton";
import PlatformAccountItem from "./PlatformAccountItem";

const PlatformAccountsList = () => {
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch platforms using RTK Query
  const {
    data: platforms,
    isLoading: platformsLoading,
    error: platformsError,
  } = useGetPlatformsQuery();

  // Fetch accounts with optional platformId filter
  const {
    data: accounts,
    isLoading: accountsLoading,
    refetch: refetchAccounts,
    error: accountsError,
  } = useGetPlatformAccountsQuery(
    selectedPlatformId ? { platformId: selectedPlatformId } : {}
  );

  // Delete account mutation
  const [deleteAccount, { isLoading: isDeleting }] =
    useDeletePlatformAccountMutation();

  const handlePlatformFilterChange = (e) => {
    setSelectedPlatformId(e.target.value);
  };

  const handleAddAccount = () => {
    setAccountToEdit(null);
    setShowModal(true);
  };

  const handleEditAccount = (account) => {
    setAccountToEdit(account);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setAccountToEdit(null);
  };

  const handleDeleteClick = (accountId) => {
    setDeleteAccountId(accountId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteAccountId) {
      try {
        await deleteAccount(deleteAccountId).unwrap();
        setShowDeleteConfirm(false);
        setDeleteAccountId(null);
      } catch (err) {
        console.error("Failed to delete account:", err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteAccountId(null);
  };

  if (platformsLoading || accountsLoading) {
    return <div className="p-4 flex justify-center">Loading accounts...</div>;
  }

  if (platformsError || accountsError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {platformsError
          ? `Error loading platforms: ${platformsError.message}`
          : ""}
        {accountsError
          ? `Error loading accounts: ${accountsError.message}`
          : ""}
        <button
          onClick={refetchAccounts}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Platform Accounts</h2>
        <div className="flex space-x-4">
          <div>
            <select
              value={selectedPlatformId}
              onChange={handlePlatformFilterChange}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">All Platforms</option>
              {platforms &&
                platforms.map((platform) => (
                  <option key={platform._id} value={platform._id}>
                    {platform.name}
                  </option>
                ))}
            </select>
          </div>
          <NewAccountButton onClick={handleAddAccount} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <PlatformAccountItem
              key={account._id}
              account={account}
              onEdit={() => handleEditAccount(account)}
              onDelete={() => handleDeleteClick(account._id)}
            />
          ))
        ) : (
          <div className="col-span-full p-4 text-center text-gray-500 bg-gray-100 rounded">
            No accounts found. Add a new platform account to get started.
          </div>
        )}
      </div>

      {/* Account Form Modal - Would be implemented in a separate component */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Account form would go here */}
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">
              {accountToEdit ? "Edit Platform Account" : "Add Platform Account"}
            </h3>
            {/* Form would go here */}
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                {accountToEdit ? "Update" : "Add"} Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAccountsList;
