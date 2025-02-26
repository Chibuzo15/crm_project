import React from "react";
import { formatDistanceToNow } from "date-fns";

const ChatListItem = ({ chat, isSelected, onClick }) => {
  const {
    candidateName,
    candidateUsername,
    lastMessage,
    lastMessageDate,
    platform,
    jobType,
    status,
    unreadCount = 0,
  } = chat;

  // Format the time string
  const formattedTime = lastMessageDate
    ? formatDistanceToNow(new Date(lastMessageDate), { addSuffix: true })
    : "";

  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case "starred":
        return "bg-yellow-100";
      case "working on poc":
        return "bg-blue-100";
      case "to archive":
        return "bg-gray-100";
      case "closed":
        return "bg-red-100";
      default:
        return "bg-green-100";
    }
  };

  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-50 ${
        isSelected ? "bg-blue-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-gray-900 truncate">
          {candidateName || candidateUsername}

          {unreadCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        <span className="text-xs text-gray-500">{formattedTime}</span>
      </div>

      <div className="flex items-center mb-2 text-xs">
        {platform && (
          <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded mr-1">
            {platform.name}
          </span>
        )}

        {jobType && (
          <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded mr-1">
            {jobType.title}
          </span>
        )}

        {status && (
          <span
            className={`${getStatusColor()} px-1.5 py-0.5 rounded text-gray-800`}
          >
            {status}
          </span>
        )}
      </div>

      {lastMessage && (
        <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
      )}
    </div>
  );
};

export default ChatListItem;
