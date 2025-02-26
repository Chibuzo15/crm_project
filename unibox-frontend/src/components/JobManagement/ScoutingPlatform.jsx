import React from "react";

const ScoutingPlatform = ({ platform, platformPlan, onPlatformChange }) => {
  const handleNewChatsPerDayChange = (e) => {
    onPlatformChange({ newChatsPerDay: parseInt(e.target.value, 10) });
  };

  const handleGoalLeadsChange = (e) => {
    onPlatformChange({ goalLeads: parseInt(e.target.value, 10) });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h5 className="text-lg font-medium text-gray-900 mb-3">
        {platform.name}
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New chats per day:
          </label>
          <input
            type="number"
            min="1"
            value={platformPlan.newChatsPerDay}
            onChange={handleNewChatsPerDayChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            How many new candidates should be contacted each day
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal leads:
          </label>
          <input
            type="number"
            min="1"
            value={platformPlan.goalLeads}
            onChange={handleGoalLeadsChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Total number of leads to acquire from this platform
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Progress tracking:</span>
          <span className="ml-1">
            This feature is auto-tracked by Unibox. New leads will be counted
            when they match the selected job type.
          </span>
        </p>
      </div>
    </div>
  );
};

export default ScoutingPlatform;
