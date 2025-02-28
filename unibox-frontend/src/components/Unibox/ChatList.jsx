import React from "react";
import ChatListItem from "./ChatListItem";
import { useGetChatsQuery } from "../../store/api";

const ChatList = ({ selectedChatId, onChatSelect, filters = {} }) => {
  // Use RTK Query hook for fetching chats with filters
  const {
    data: chats = [],
    isLoading: loading,
    error,
  } = useGetChatsQuery(filters);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-500">Loading chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading chats. Please try again.</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-6 text-center">
        <svg
          className="w-12 h-12 mx-auto text-gray-400"
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
        <p className="mt-2 text-gray-500">No chats found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {chats.map((chat) => (
        <ChatListItem
          key={chat._id}
          chat={chat}
          isSelected={chat._id === selectedChatId}
          onClick={() => onChatSelect(chat)}
        />
      ))}
    </div>
  );
};

export default ChatList;
