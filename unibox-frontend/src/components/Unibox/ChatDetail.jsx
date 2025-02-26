import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { fetchMessages, markMessagesAsRead } from "../../store/messageSlice";

const ChatDetail = ({ chat, onSendMessage }) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { messages, loading } = useSelector((state) => state.message);
  const [attachments, setAttachments] = useState([]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (chat && chat._id) {
      dispatch(fetchMessages(chat._id));
    }
  }, [chat, dispatch]);

  // Mark messages as read when viewed
  useEffect(() => {
    if (chat && chat._id && chat.unreadCount > 0) {
      dispatch(markMessagesAsRead(chat._id));
    }
  }, [chat, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content) => {
    if (content.trim() === "" && attachments.length === 0) return;

    onSendMessage(content, attachments);
    setAttachments([]);
  };

  const handleAttachmentAdd = (files) => {
    // Convert FileList to Array
    const filesArray = Array.from(files);

    // Create file objects with preview URLs
    const newAttachments = filesArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const handleAttachmentRemove = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a chat to start messaging
          </h3>
          <p className="text-gray-500">
            Or use the search and filters to find specific conversations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader chat={chat} />

      <div className="flex-1 overflow-hidden bg-gray-50">
        <MessageList
          messages={messages}
          loading={loading}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        onAttachmentAdd={handleAttachmentAdd}
        onAttachmentRemove={handleAttachmentRemove}
        attachments={attachments}
      />
    </div>
  );
};

export default ChatDetail;
