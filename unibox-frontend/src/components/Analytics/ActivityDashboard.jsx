// File: src/components/Analytics/ActivityDashboard.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserActivity } from "../../redux/actions/analyticsActions";
import DatePicker from "react-datepicker";
import UserPerformanceChart from "./UserPerformanceChart";
import DailyResultsChart from "./DailyResultsChart";
import MetricsCards from "./MetricsCards";
import "react-datepicker/dist/react-datepicker.css";
import "./ActivityDashboard.css";

const ActivityDashboard = () => {
  const dispatch = useDispatch();
  const { userActivity, dailyResults, loading, error } = useSelector(
    (state) => state.analytics
  );
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 30)), // 30 days ago
    new Date(), // Today
  ]);
  const [startDate, endDate] = dateRange;
  const [selectedUser, setSelectedUser] = useState("all");

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        fetchUserActivity({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          userId: selectedUser !== "all" ? selectedUser : undefined,
        })
      );
    }
  }, [dispatch, startDate, endDate, selectedUser]);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  // Calculate summary metrics
  const calculateMetrics = () => {
    if (!userActivity || userActivity.length === 0) {
      return {
        totalMessages: 0,
        onTimePercentage: 0,
        avgMessagesPerDay: 0,
        totalChats: 0,
      };
    }

    const totalMessages = userActivity.reduce(
      (sum, day) => sum + day.totalMessages,
      0
    );
    const onTimeMessages = userActivity.reduce(
      (sum, day) => sum + day.messagesOnTime,
      0
    );
    const onTimePercentage =
      totalMessages > 0
        ? Math.round((onTimeMessages / totalMessages) * 100)
        : 0;

    const days = userActivity.length;
    const avgMessagesPerDay =
      days > 0 ? Math.round((totalMessages / days) * 10) / 10 : 0;

    // Count unique chats
    const uniqueChats = new Set();
    userActivity.forEach((day) => {
      (day.chatsInteracted || []).forEach((chatId) => uniqueChats.add(chatId));
    });

    return {
      totalMessages,
      onTimePercentage,
      avgMessagesPerDay,
      totalChats: uniqueChats.size,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="activity-dashboard">
      <h2>User Activity Dashboard</h2>

      <div className="dashboard-controls">
        <div className="date-range-picker">
          <label>Date Range:</label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            className="date-picker"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="user-selector">
          <label>User:</label>
          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="user-select"
          >
            <option value="all">All Users</option>
            {useSelector((state) => state.user.users).map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading activity data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <MetricsCards metrics={metrics} />

          <div className="charts-container">
            <div className="chart-section">
              <h3>Daily Performance</h3>
              <UserPerformanceChart data={userActivity} />
            </div>

            <div className="chart-section">
              <h3>Job Results</h3>
              <DailyResultsChart data={dailyResults} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityDashboard;
