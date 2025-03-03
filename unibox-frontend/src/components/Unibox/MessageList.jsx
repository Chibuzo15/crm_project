import React, { useMemo } from "react";
import Message from "./Message";

const MessageList = ({ messages, loading, messagesEndRef }) => {
  // Function to ensure unique messages by checking _id
  const uniqueMessages = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    // Use a Map to track unique messages by _id
    const uniqueMap = new Map();

    // Only add a message if its _id hasn't been seen before
    messages.forEach((message) => {
      if (message._id && !uniqueMap.has(message._id)) {
        uniqueMap.set(message._id, message);
      }
    });

    // Convert Map values back to array
    return Array.from(uniqueMap.values());
  }, [messages]);

  const groupMessagesByDate = () => {
    const groups = {};

    uniqueMessages.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateStr = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }

      groups[dateStr].push(message);
    });

    // Sort the groups chronologically
    const sortedGroups = {};
    Object.keys(groups)
      .sort((a, b) => new Date(a) - new Date(b))
      .forEach((key) => {
        sortedGroups[key] = groups[key].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      });

    return sortedGroups;
  };

  const messageGroups = groupMessagesByDate();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!uniqueMessages.length) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md">
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          <p className="text-gray-500">
            No messages yet. Start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-y-auto">
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date}>
          <div className="flex justify-center my-3">
            <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
              {date}
            </div>
          </div>

          <div className="space-y-3">
            {msgs.map((message) => (
              <Message key={message._id} message={message} />
            ))}
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
