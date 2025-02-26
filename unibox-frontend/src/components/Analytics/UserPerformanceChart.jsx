import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-md">
        <p className="text-gray-500">No performance data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((day) => ({
    date: day.date
      ? new Date(day.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "",
    onTime: day.messagesOnTime || 0,
    offTime: day.messagesOffTime || 0,
    total: day.totalMessages || 0,
  }));

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="Total Messages"
            stroke="#6366F1"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="onTime"
            name="On-Time"
            stroke="#10B981"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="offTime"
            name="Delayed"
            stroke="#EF4444"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserPerformanceChart;
