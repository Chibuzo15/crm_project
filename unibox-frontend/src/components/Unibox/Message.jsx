// File: src/components/Unibox/Message.jsx
import React from "react";
import { formatTime } from "../../utils/dateUtils";
import AttachmentPreview from "./AttachmentPreview";
import "./Message.css";

const Message = ({ message }) => {
  const { content, createdAt, isFromUs, sender, attachments = [] } = message;

  const messageTime = formatTime(createdAt);
  const hasAttachments = attachments.length > 0;

  return (
    <div
      className={`message ${isFromUs ? "message-sent" : "message-received"}`}
    >
      <div className="message-content">
        {content && <p>{content}</p>}

        {hasAttachments && (
          <div className="message-attachments">
            {attachments.map((attachment, index) => (
              <AttachmentPreview key={index} attachment={attachment} />
            ))}
          </div>
        )}

        <div className="message-footer">
          <span className="message-time">{messageTime}</span>
          {isFromUs && sender && (
            <span className="message-sender">{sender.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
