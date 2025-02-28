import React, { useState, useRef } from "react";
import AttachmentPreview from "./AttachmentPreview";

const MessageInput = ({
  onSendMessage,
  onAttachmentAdd,
  onAttachmentRemove,
  attachments = [],
}) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "" && attachments.length === 0) return;

    onSendMessage(message);
    setMessage("");
    messageInputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Send message on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAttachmentAdd(e.target.files);

      // Reset the file input value so the same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative">
              <AttachmentPreview attachment={attachment} />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1 shadow-sm text-gray-500 hover:text-red-500"
                onClick={() => onAttachmentRemove(index)}
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end">
        <button
          type="button"
          className="p-2 -mb-1 text-gray-500 hover:text-blue-500 focus:outline-none"
          onClick={handleAttachmentClick}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />

        <div className="flex-1 mx-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={messageInputRef}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Type a message..."
            rows={1}
            style={{
              minHeight: "40px",
              maxHeight: "120px",
            }}
          ></textarea>
        </div>

        <button
          type="submit"
          className={`p-2 rounded-full ${
            message.trim() || attachments.length > 0
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-400"
          }`}
          disabled={message.trim() === "" && attachments.length === 0}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
