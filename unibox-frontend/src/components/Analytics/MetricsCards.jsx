import React from "react";

const MetricsCards = ({ metrics }) => {
  const { totalMessages, onTimePercentage, avgMessagesPerDay, totalChats } =
    metrics;

  // Get color class for percentage
  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Total Messages
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {totalMessages.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-500 mb-1">
            On-Time Responses
          </div>
          <div
            className={`text-3xl font-bold ${getPercentageColor(
              onTimePercentage
            )}`}
          >
            {onTimePercentage}%
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Avg. Messages/Day
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {avgMessagesPerDay.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Active Chats
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {totalChats.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
