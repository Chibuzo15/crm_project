// File: src/components/JobManagement/ScoutingPlatform.jsx
import React from "react";
import "./ScoutingPlatform.css";

const ScoutingPlatform = ({ platform, platformPlan, onPlatformChange }) => {
  const handleNewChatsPerDayChange = (e) => {
    onPlatformChange({ newChatsPerDay: parseInt(e.target.value, 10) });
  };

  const handleGoalLeadsChange = (e) => {
    onPlatformChange({ goalLeads: parseInt(e.target.value, 10) });
  };

  return (
    <div className="scouting-platform">
      <h5>{platform.name}</h5>

      <div className="chat-goals">
        <div className="form-group">
          <label>New chats per day:</label>
          <input
            type="number"
            min="1"
            value={platformPlan.newChatsPerDay}
            onChange={handleNewChatsPerDayChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Goal leads:</label>
          <input
            type="number"
            min="1"
            value={platformPlan.goalLeads}
            onChange={handleGoalLeadsChange}
            className="form-control"
          />
        </div>
      </div>
    </div>
  );
};

export default ScoutingPlatform;
