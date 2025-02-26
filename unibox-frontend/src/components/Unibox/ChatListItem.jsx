// File: src/components/Unibox/ChatListItem.jsx
import React from "react";
import { formatDistanceToNow } from "date-fns";
import "./ChatListItem.css";

const ChatListItem = ({ chat, isSelected, onClick }) => {
  const {
    candidateName,
    candidateUsername,
    lastMessage,
    lastMessageDate,
    platform,
    jobType,
    unreadCount,
  } = chat;

  const formattedTime = lastMessageDate
    ? formatDistanceToNow(new Date(lastMessageDate), { addSuffix: true })
    : "";

  return (
    <div
      className={`chat-list-item ${isSelected ? "selected" : ""} ${
        unreadCount > 0 ? "unread" : ""
      }`}
      onClick={onClick}
    >
      {unreadCount > 0 && (
        <div className="unread-indicator">
          <span>{unreadCount}</span>
        </div>
      )}

      <div className="chat-list-item-content">
        <div className="chat-list-item-header">
          <h4>{candidateName || candidateUsername}</h4>
          <span className="time">{formattedTime}</span>
        </div>

        <div className="chat-list-item-subheader">
          {jobType && jobType.title && (
            <span className="job-type">{jobType.title}</span>
          )}
          {platform && platform.name && (
            <span className="platform">{platform.name}</span>
          )}
        </div>

        {lastMessage && (
          <p className="last-message">
            {lastMessage.length > 60
              ? lastMessage.substring(0, 60) + "..."
              : lastMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;
