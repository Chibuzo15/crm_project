import React from "react";
import { useNavigate } from "react-router-dom";
import { useStarChatMutation } from "../../store/api";

const ChatHeader = ({ chat }) => {
  const navigate = useNavigate();

  // Star chat mutation
  const [starChat, { isLoading: isStarring }] = useStarChatMutation();

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
        await starChat(chat._id).unwrap();
      } catch (error) {
        console.error("Failed to star chat:", error);
      }
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

        <button
          onClick={handleStarChat}
          className={`p-2 rounded-full ${
            chat.isStarred
              ? "text-yellow-500"
              : "text-gray-400 hover:text-yellow-500"
          }`}
          disabled={isStarring}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill={chat.isStarred ? "currentColor" : "none"}
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
