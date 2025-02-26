// File: src/components/Analytics/MetricsCards.jsx
import React from "react";
import "./MetricsCards.css";

const MetricsCards = ({ metrics }) => {
  const { totalMessages, onTimePercentage, avgMessagesPerDay, totalChats } =
    metrics;

  return (
    <div className="metrics-cards">
      <div className="metric-card">
        <div className="metric-value">{totalMessages}</div>
        <div className="metric-label">Total Messages</div>
      </div>

      <div className="metric-card">
        <div className="metric-value">{onTimePercentage}%</div>
        <div className="metric-label">On-Time Response</div>
      </div>

      <div className="metric-card">
        <div className="metric-value">{avgMessagesPerDay}</div>
        <div className="metric-label">Avg. Messages/Day</div>
      </div>

      <div className="metric-card">
        <div className="metric-value">{totalChats}</div>
        <div className="metric-label">Active Chats</div>
      </div>
    </div>
  );
};

export default MetricsCards;
