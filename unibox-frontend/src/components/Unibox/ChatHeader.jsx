import React from "react";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ chat }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/unibox");
  };

  const handleProfileClick = () => {
    if (chat.platformAccount && chat.candidateUsername) {
      // Open the candidate's profile on the original platform in a new tab
      // This is a placeholder - would need platform-specific logic
      const platformName = chat.platform?.name?.toLowerCase() || "";
      let profileUrl = "";

      switch (platformName) {
        case "upwork":
          profileUrl = `https://www.upwork.com/freelancers/${chat.candidateUsername}`;
          break;
        case "fiverr":
          profileUrl = `https://www.fiverr.com/${chat.candidateUsername}`;
          break;
        case "behance":
          profileUrl = `https://www.behance.net/${chat.candidateUsername}`;
          break;
        case "pinterest":
          profileUrl = `https://www.pinterest.com/${chat.candidateUsername}`;
          break;
        default:
          alert("Profile URL not available");
          return;
      }

      window.open(profileUrl, "_blank");
    }
  };

  return (
    <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <button
          className="md:hidden p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={handleBackClick}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div>
          <h3 className="font-medium text-gray-900">
            {chat.candidateName || chat.candidateUsername}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            {chat.jobType && <span className="mr-2">{chat.jobType.title}</span>}
            {chat.platform && <span>{chat.platform.name}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          onClick={handleProfileClick}
        >
          View Profile
        </button>

        <div className="relative">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {/* Dropdown menu would go here */}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
