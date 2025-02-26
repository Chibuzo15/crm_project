import React from "react";
import { format } from "date-fns";
import AttachmentPreview from "./AttachmentPreview";

const Message = ({ message }) => {
  const { content, createdAt, isFromUs, sender, attachments = [] } = message;

  const messageTime = createdAt ? format(new Date(createdAt), "h:mm a") : "";
  const hasAttachments = attachments.length > 0;

  return (
    <div className={`flex mb-4 ${isFromUs ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] ${
          isFromUs ? "bg-blue-500 text-white" : "bg-white text-gray-800"
        } rounded-lg px-4 py-2 shadow`}
      >
        {content && <p className="whitespace-pre-wrap">{content}</p>}

        {hasAttachments && (
          <div className="mt-2 space-y-2">
            {attachments.map((attachment, index) => (
              <AttachmentPreview key={index} attachment={attachment} />
            ))}
          </div>
        )}

        <div
          className={`flex items-center text-xs mt-1 ${
            isFromUs ? "text-blue-100" : "text-gray-500"
          }`}
        >
          <span className="message-time">{messageTime}</span>
          {isFromUs && sender && <span className="ml-2">• {sender.name}</span>}
        </div>
      </div>
    </div>
  );
};

export default Message;
