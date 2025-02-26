import React, { useState, useRef } from "react";

const MessageInput = ({
  onSendMessage,
  onAttachmentAdd,
  onAttachmentRemove,
  attachments = [],
}) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onAttachmentAdd(e.target.files);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 px-3 py-1 rounded text-sm"
            >
              <span className="truncate max-w-[120px]">{attachment.name}</span>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => onAttachmentRemove(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <form className="flex items-center" onSubmit={handleSubmit}>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full focus:outline-none"
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
          className="hidden"
          multiple
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-grow mx-2 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={1}
        />

        <button
          type="submit"
          className={`p-2 rounded-full ${
            message.trim() || attachments.length > 0
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!message.trim() && attachments.length === 0}
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
