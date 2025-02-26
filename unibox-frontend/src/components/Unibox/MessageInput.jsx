/ File: src/components/Unibox/MessageInput.jsx
import React, { useState, useRef } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, onAttachmentAdd, onAttachmentRemove, attachments = [] }) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
      e.target.value = '';
    }
  };

  return (
    <div className="message-input-container">
      {attachments.length > 0 && (
        <div className="attachment-previews">
          {attachments.map((attachment, index) => (
            <div key={index} className="attachment-preview-item">
              <div className="attachment-name">{attachment.name}</div>
              <button
                className="remove-attachment"
                onClick={() => onAttachmentRemove(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <form className="message-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="attach-button"
          onClick={handleAttachmentClick}
        >
          <i className="attachment-icon"></i>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="message-textarea"
          rows={1}
        />

        <button
          type="submit"
          className="send-button"
          disabled={!message.trim() && attachments.length === 0}
        >
          <i className="send-icon"></i>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;