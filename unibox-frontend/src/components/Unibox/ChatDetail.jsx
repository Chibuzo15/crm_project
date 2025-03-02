import React, { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import {
  useGetMessagesQuery,
  useMarkMessagesAsReadMutation,
  useSendMessageWithAttachmentMutation,
} from "../../store/api";

const ChatDetail = ({ chat, socket }) => {
  const messagesEndRef = useRef(null);
  const [attachments, setAttachments] = useState([]);

  // Use RTK Query hooks instead of Redux actions
  const { data: messages = [], isLoading: loading } = useGetMessagesQuery(
    chat?._id,
    {
      skip: !chat?._id,
      pollingInterval: 10000, // Poll for new messages every 10 seconds
    }
  );

  // Mark messages as read mutation
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

  // Send message with attachment mutation
  const [sendMessageWithAttachment] = useSendMessageWithAttachmentMutation();

  // Mark messages as read when viewed
  useEffect(() => {
    if (chat && chat._id && chat.unreadCount > 0) {
      markMessagesAsRead(chat._id);
    }
  }, [chat, markMessagesAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (content.trim() === "" && attachments.length === 0) return;
    console.log("content ", content);

    try {
      if (attachments.length > 0) {
        // Check file size before upload
        const oversizedFiles = attachments.filter(
          (attachment) =>
            attachment.file && attachment.file.size > 3 * 1024 * 1024
        );

        if (oversizedFiles.length > 0) {
          console.error("Some files exceed the 3MB limit");
          alert("MAX file size is 3MB");
          return;
        }

        // If there are attachments, use the attachment endpoint
        await sendMessageWithAttachment({
          chatId: chat._id,
          content,
          attachments,
        }).unwrap();
      } else {
        // For regular messages, use socket
        socket.emit("send_message", {
          chat: chat._id,
          content,
        });
      }

      // Clear attachments after sending
      setAttachments([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
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
