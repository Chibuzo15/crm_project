// File: src/components/Unibox/MessageList.jsx
import React from "react";
import Message from "./Message";
import { formatDate } from "../../utils/dateUtils";
import "./MessageList.css";

const MessageList = ({ messages, loading, messagesEndRef }) => {
  if (loading) {
    return (
      <div className="message-list-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list-empty">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt, "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="message-list">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="message-group">
          <div className="date-divider">
            <span>{formatDate(date, "MMM d, yyyy")}</span>
          </div>

          {dateMessages.map((message) => (
            <Message key={message._id} message={message} />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
