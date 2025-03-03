import React from "react";
import { useNavigate } from "react-router-dom";
import { useStarChatMutation } from "../../store/api";

const ChatHeader = ({ chat, onUpdateChat }) => {
  const navigate = useNavigate();

  // Star chat mutation
  const [starChat, { isLoading: isStarring }] = useStarChatMutation();

  const isStarred = chat?.status == "starred";

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

  const handleStarChat = async () => {
    if (chat._id && !isStarring) {
      try {
        await onUpdateChat("status", isStarred ? "active" : "starred");
      } catch (error) {
        console.error("Failed to star chat:", error);
      }
    }
  };

  return (
    <div className="min-h-16 px-4 border-b border-gray-200  items-center justify-between bg-white">
      <div className="flex">
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
        <h3 className="font-medium text-gray-900">
          {chat.candidateName || chat.candidateUsername}
        </h3>
      </div>

      <div className="flex">
        <div className="flex items-center">
          <div>
            <div className="flex items-center text-sm text-gray-500">
              {chat.jobType && (
                <span className="mr-2">{chat.jobType.title}</span>
              )}
              {chat.platform && <span>{chat.platform.name}</span>}
            </div>
          </div>
        </div>

        <div className="flex w-[30%] ml-[auto] justify-end items-center space-x-3">
          <button
            onClick={handleStarChat}
            className={` rounded-full ${
              isStarred
                ? "text-yellow-500"
                : "text-gray-400 hover:text-yellow-500"
            }`}
            disabled={isStarring}
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill={isStarred ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>

          <button
            className=" py-1.5 !w-[120px] text-xs  text-blue-600 rounded-md transition-colors underline"
            onClick={handleProfileClick}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
