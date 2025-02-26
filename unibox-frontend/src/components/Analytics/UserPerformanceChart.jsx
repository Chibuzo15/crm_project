// File: src/components/Analytics/UserPerformanceChart.jsx
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
import { formatDate } from "../../utils/dateUtils";
import "./UserPerformanceChart.css";

const UserPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-data-message">No performance data available</div>;
  }

  // Prepare data for chart
  const chartData = data.map((day) => ({
    date: formatDate(day.date, "MMM d"),
    onTime: day.messagesOnTime,
    offTime: day.messagesOffTime,
    total: day.totalMessages,
  }));

  return (
    <div className="user-performance-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="Total Messages"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="onTime"
            name="On-Time Messages"
            stroke="#4CAF50"
          />
          <Line
            type="monotone"
            dataKey="offTime"
            name="Delayed Messages"
            stroke="#FF5722"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserPerformanceChart;
