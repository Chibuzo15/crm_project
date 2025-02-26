import React from "react";
import Message from "./Message";
import { format } from "date-fns";

const MessageList = ({ messages, loading, messagesEndRef }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-500">
            No messages yet. Start the conversation!
          </p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    if (!message.createdAt) return groups;

    const date = format(new Date(message.createdAt), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute border-t border-gray-200 w-full"></div>
            <span className="relative bg-gray-50 px-2 text-xs text-gray-500">
              {format(new Date(date), "MMMM d, yyyy")}
            </span>
          </div>

          {dateMessages.map((message) => (
            <Message key={message._id || message.tempId} message={message} />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
