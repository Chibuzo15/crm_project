//AttachmentPreview.jsx
import React from "react";

const AttachmentPreview = ({ attachment }) => {
  const { filename, mimetype, path, originalName, size } = attachment;

  const FILE_URL =
    import.meta.env.VITE_FILE_URL || "http://localhost:5000/uploads";

  // Format file size to human-readable
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename?.split(".").pop().toLowerCase() || "";
  };

  // Get display name (use original name if available)
  const displayName = originalName || filename || attachment.name || "File";

  // Check if it's an image
  const isImage =
    mimetype?.startsWith("image/") || attachment.type?.startsWith("image/");

  // Build file URL (handle both client-side preview URLs and server paths)
  const isLocalPreview = attachment.preview && attachment.file;
  const fileUrl = (() => {
    // For local preview
    if (isLocalPreview) return attachment.preview;

    // For server-side images
    if (attachment.filename) {
      return `${FILE_URL}/${attachment.filename}`;
    }

    // Fallback
    return attachment.path || "";
  })();

  const handleImageLoadError = (e) => {
    // console.error("Failed to load image:", e);
    console.error("Image load error:", {
      src: e.target.src,
      error: e.type,
      naturalWidth: e.target.naturalWidth,
      complete: e.target.complete,
    });
  };

  // File icon SVG based on file type
  const renderFileIcon = () => {
    const ext = getFileExtension(displayName);

    // PDF icon
    if (ext === "pdf") {
      return (
        <svg
          className="h-8 w-8 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    }

    // Document icon (doc, docx)
    if (["doc", "docx"].includes(ext)) {
      return (
        <svg
          className="h-8 w-8 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }

    // Spreadsheet icon (xls, xlsx)
    if (["xls", "xlsx"].includes(ext)) {
      return (
        <svg
          className="h-8 w-8 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }

    // Archive icon (zip, rar)
    if (["zip", "rar"].includes(ext)) {
      return (
        <svg
          className="h-8 w-8 text-yellow-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      );
    }

    // Default file icon
    return (
      <svg
        className="h-8 w-8 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  };

  return (
    <div className="rounded-md overflow-hidden">
      {isImage && fileUrl ? (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={fileUrl}
            alt={displayName}
            onError={handleImageLoadError}
            className="max-h-40 max-w-full rounded object-contain"
          />
        </a>
      ) : (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors"
        >
          {renderFileIcon()}
          <div className="ml-2 overflow-hidden">
            <div className="text-sm font-medium truncate max-w-[180px]">
              {displayName}
            </div>
            {size && (
              <div className="text-xs text-gray-500">
                {formatFileSize(size)}
              </div>
            )}
          </div>
        </a>
      )}
    </div>
  );
};

export default AttachmentPreview;
