import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DailyResultsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-md">
        <p className="text-gray-500">No results data available</p>
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
    newLeads: day.newLeads || 0,
    conversions: day.conversions || 0,
    jobPostings: day.jobPostings || 0,
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
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="newLeads" name="New Leads" fill="#3B82F6" />
          <Bar dataKey="conversions" name="Conversions" fill="#10B981" />
          <Bar dataKey="jobPostings" name="Job Postings" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyResultsChart;
