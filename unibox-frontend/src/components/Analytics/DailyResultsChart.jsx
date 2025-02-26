// File: src/components/Analytics/DailyResultsChart.jsx
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
import { formatDate } from "../../utils/dateUtils";
import "./DailyResultsChart.css";

const DailyResultsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-data-message">No results data available</div>;
  }

  // Prepare data for chart
  const chartData = data.map((day) => ({
    date: formatDate(day.date, "MMM d"),
    newLeads: day.newLeads || 0,
    conversions: day.conversions || 0,
    jobPostings: day.jobPostings || 0,
  }));

  return (
    <div className="daily-results-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
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
          <Bar dataKey="newLeads" name="New Leads" fill="#3498db" />
          <Bar dataKey="conversions" name="Conversions" fill="#2ecc71" />
          <Bar dataKey="jobPostings" name="Job Postings" fill="#9b59b6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyResultsChart;
