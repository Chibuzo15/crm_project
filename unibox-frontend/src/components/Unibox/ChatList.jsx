// File: src/components/Unibox/ChatList.jsx
import React from "react";
import ChatListItem from "./ChatListItem";
import "./ChatList.css";

const ChatList = ({ chats, loading, selectedChatId, onChatSelect }) => {
  if (loading) {
    return (
      <div className="chat-list loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="chat-list empty">
        <p>No chats found</p>
      </div>
    );
  }

  return (
    <div className="chat-list">
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
