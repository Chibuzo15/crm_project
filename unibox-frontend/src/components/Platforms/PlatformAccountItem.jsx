import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updatePlatformAccount,
  deletePlatformAccount,
  syncAccount,
} from "../../store/accountSlice";
import { format } from "date-fns";

const PlatformAccountItem = ({ account, platform }) => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(account.username);
  const [password, setPassword] = useState(""); // Don't show actual password

  const handleToggleActive = () => {
    dispatch(
      updatePlatformAccount({
        accountId: account._id,
        updates: { active: !account.active },
      })
    );
    setShowOptions(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the account "${account.username}"?`
      )
    ) {
      dispatch(deletePlatformAccount(account._id));
    }
    setShowOptions(false);
  };

  const handleSaveEdit = () => {
    const updates = { username };
    if (password) {
      updates.password = password;
    }

    dispatch(
      updatePlatformAccount({
        accountId: account._id,
        updates,
      })
    );

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setUsername(account.username);
    setPassword("");
    setIsEditing(false);
  };

  const handleSyncNow = () => {
    dispatch(syncAccount(account._id));
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // Count number of chats associated with this account
  const chatCount = account.chatCount || 0;

  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-sm ${
        !account.active ? "bg-gray-50" : "bg-white"
      }`}
    >
      {isEditing ? (
        <div className="p-4">
          <h4 className="font-medium text-gray-800 mb-3">Edit Account</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">{account.username}</h4>

              <div className="relative">
                <button
                  className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={toggleOptions}
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {showOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleEdit}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleToggleActive}
                      >
                        {account.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-500">Status:</div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {account.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="text-gray-500">Chats:</div>
              <div className="text-right font-medium">{chatCount}</div>

              <div className="text-gray-500">Last Sync:</div>
              <div className="text-right">
                {account.lastSync
                  ? format(new Date(account.lastSync), "MMM d, yyyy")
                  : "Never"}
              </div>
            </div>

            <button
              className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 focus:outline-none"
              onClick={handleSyncNow}
            >
              Sync Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlatformAccountItem;
