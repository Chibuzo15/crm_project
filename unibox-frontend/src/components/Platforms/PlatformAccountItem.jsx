import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetPlatformByIdQuery } from "../../store/api";

const PlatformAccountItem = ({ account, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const { data: platform, isLoading: platformLoading } =
    useGetPlatformByIdQuery(account.platform?._id, {
      skip: !account.platform?._id,
    });

  // Original handlers remain unchanged
  const handleEdit = () => {
    if (onEdit) onEdit(account);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(account._id);
  };

  const handleViewChats = () => {
    if (account.chatCount > 0) {
      navigate("/unibox", {
        state: {
          platformAccount: account._id,
        },
      });
    }
  };

  const getPlatformColorClass = () => {
    if (!platform) return "bg-gray-200";

    switch (platform.name.toLowerCase()) {
      case "upwork":
        return "bg-green-100 text-green-800";
      case "fiverr":
        return "bg-teal-100 text-teal-800";
      case "behance":
        return "bg-blue-100 text-blue-800";
      case "pinterest":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{account.username}</h3>
          <div className="flex items-center mt-1">
            {platformLoading ? (
              <div className="animate-pulse h-5 w-16 bg-gray-200 rounded"></div>
            ) : (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColorClass()}`}
              >
                {platform?.name || "Unknown Platform"}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-1 rounded hover:bg-gray-100"
            title="Edit Account"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-gray-100"
            title="Delete Account"
          >
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        {/* <div className="flex items-center mb-1">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span>
            Last Sync:{" "}
            {account.lastSync
              ? new Date(account.lastSync).toLocaleDateString()
              : "Never"}
          </span>
        </div> */}

        <div className="flex items-center">
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
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            ></path>
          </svg>
          <span>Chats: {account.chatCount || 0}</span>
        </div>
        {account.chatCount > 0 && (
          <button
            onClick={handleViewChats}
            className="text-xs text-blue-600 hover:text-blue-800 underline ml-6"
          >
            View Chats
          </button>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
        <button
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          onClick={handleEdit}
        >
          <span>Manage Account</span>
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
        </button>
      </div>
    </div>
  );
};

export default PlatformAccountItem;
