import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserActivity } from "../../store/analyticsSlice";
import DatePicker from "react-datepicker";
import UserPerformanceChart from "./UserPerformanceChart";
import DailyResultsChart from "./DailyResultsChart";
import MetricsCards from "./MetricsCards";
import "react-datepicker/dist/react-datepicker.css";
import {
  useGetDailyActivityQuery,
  useGetUserActivityQuery,
  useGetUsersQuery,
} from "../../store/api";

const ActivityDashboard = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.analytics);
  // const users = useSelector((state) => state.user.users);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState("all");

  const { data: users, isLoading: usersLoading } = useGetUsersQuery({});

  // Use RTK Query hooks
  const {
    data: userActivity = [],
    isLoading: isLoadingUserActivity,
    error: userActivityError,
  } = useGetUserActivityQuery({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    userId: selectedUser !== "all" ? selectedUser : undefined,
  });

  const {
    data: dailyResults = [],
    isLoading: isLoadingDailyResults,
    error: dailyResultsError,
  } = useGetDailyActivityQuery({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    userId: selectedUser !== "all" ? selectedUser : undefined,
  });

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     dispatch(
  //       fetchUserActivity({
  //         startDate: startDate.toISOString().split("T")[0],
  //         endDate: endDate.toISOString().split("T")[0],
  //         userId: selectedUser !== "all" ? selectedUser : undefined,
  //       })
  //     );
  //   }
  // }, [dispatch, startDate, endDate, selectedUser]);

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
        messagesPerDayOnTime: 0,
        messagesPerDayOffTime: 0,
      };
    }

    const totalMessages = userActivity.reduce(
      (sum, day) => sum + (day.totalMessages || 0),
      0
    );
    const onTimeMessages = userActivity.reduce(
      (sum, day) => sum + (day.messagesOnTime || 0),
      0
    );
    const offTimeMessages = userActivity.reduce(
      (sum, day) => sum + (day.messagesOffTime || 0),
      0
    );
    const onTimePercentage =
      totalMessages > 0
        ? Math.round((onTimeMessages / totalMessages) * 100)
        : 0;

    const days = userActivity.length;
    const avgMessagesPerDay =
      days > 0 ? Math.round((totalMessages / days) * 10) / 10 : 0;
    const messagesPerDayOnTime =
      days > 0 ? Math.round((onTimeMessages / days) * 10) / 10 : 0;
    const messagesPerDayOffTime =
      days > 0 ? Math.round((offTimeMessages / days) * 10) / 10 : 0;

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
      messagesPerDayOnTime,
      messagesPerDayOffTime,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="p-6 ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Activity Dashboard
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range:
            </label>
            <div className="flex space-x-2">
              <div className="flex">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="flex">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="End Date"
                  className="w-full text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User:
            </label>
            <select
              value={selectedUser}
              onChange={handleUserChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoadingUserActivity || isLoadingDailyResults ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : userActivityError || dailyResultsError ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">
            {userActivityError?.message || dailyResultsError?.message}
          </p>
        </div>
      ) : (
        <>
          <MetricsCards metrics={metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Daily Performance
              </h3>
              <UserPerformanceChart data={userActivity} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Job Results
              </h3>
              <DailyResultsChart data={dailyResults} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityDashboard;
