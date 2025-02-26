// File: src/components/Unibox/AttachmentPreview.jsx
import React from "react";
import "./AttachmentPreview.css";

const AttachmentPreview = ({ attachment }) => {
  const { filename, mimetype, path, originalName, size } = attachment;

  // Format file size to human-readable
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  // Get display name (use original name if available)
  const displayName = originalName || filename;

  // Get icon class based on file type
  const getIconClass = () => {
    if (mimetype?.startsWith("image/")) return "image";

    const ext = getFileExtension(filename);
    switch (ext) {
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "word";
      case "xls":
      case "xlsx":
        return "excel";
      case "ppt":
      case "pptx":
        return "powerpoint";
      case "zip":
      case "rar":
        return "archive";
      default:
        return "file";
    }
  };

  // Check if it's an image
  const isImage = mimetype?.startsWith("image/");

  // Build file URL (handle both client-side preview URLs and server paths)
  const fileUrl = path?.startsWith("http")
    ? path
    : path
    ? `/uploads/${path}`
    : attachment.preview || "";

  return (
    <div className="attachment-preview">
      {isImage ? (
        <div className="attachment-image">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={fileUrl} alt={displayName} />
          </a>
        </div>
      ) : (
        <div className="attachment-file">
          <div className={`file-icon ${getIconClass()}`}></div>
          <div className="file-info">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {displayName}
            </a>
            <span className="file-size">{formatFileSize(size)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentPreview;
