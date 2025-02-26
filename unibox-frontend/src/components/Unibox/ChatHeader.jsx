// File: src/components/Unibox/ChatHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChatHeader.css";

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
    <div className="chat-header">
      <button className="back-button" onClick={handleBackClick}>
        <i className="back-icon"></i>
      </button>

      <div className="candidate-info">
        <h3>{chat.candidateName || chat.candidateUsername}</h3>
        <div className="candidate-details">
          {chat.jobType && (
            <span className="job-type">{chat.jobType.title}</span>
          )}
          {chat.platform && (
            <span className="platform">{chat.platform.name}</span>
          )}
        </div>
      </div>

      <div className="header-actions">
        <button className="profile-button" onClick={handleProfileClick}>
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
