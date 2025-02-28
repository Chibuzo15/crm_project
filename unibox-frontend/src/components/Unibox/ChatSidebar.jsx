import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useUpdateChatMutation,
  useGetJobTypesQuery,
  useGetPlatformsQuery,
} from "../../store/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ChatSidebar = ({ chat, onUpdate }) => {
  // Use RTK Query hooks instead of using useSelector for these
  const { data: jobTypes = [] } = useGetJobTypesQuery();
  const { data: platforms = [] } = useGetPlatformsQuery();

  // Use updateChat mutation instead of dispatch
  const [updateChat, { isLoading: isUpdating }] = useUpdateChatMutation();

  const [notes, setNotes] = useState(chat.notes || "");
  const [status, setStatus] = useState(chat.status || "");
  const [jobTypeId, setJobTypeId] = useState(
    chat.jobType?._id || chat.jobType || ""
  );
  const [followUpDate, setFollowUpDate] = useState(
    chat.followUpDate ? new Date(chat.followUpDate) : null
  );
  const [followUpInterval, setFollowUpInterval] = useState(
    chat.followUpInterval || 2
  );

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleNotesBlur = async () => {
    if (notes !== chat.notes) {
      try {
        await updateChat({
          id: chat._id,
          updates: { notes },
        }).unwrap();

        onUpdate("notes", notes);
      } catch (error) {
        console.error("Failed to update notes:", error);
      }
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await updateChat({
        id: chat._id,
        updates: { status: newStatus },
      }).unwrap();

      onUpdate("status", newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleJobTypeChange = async (e) => {
    const newJobTypeId = e.target.value;
    setJobTypeId(newJobTypeId);

    try {
      await updateChat({
        id: chat._id,
        updates: { jobType: newJobTypeId },
      }).unwrap();

      onUpdate("jobType", newJobTypeId);
    } catch (error) {
      console.error("Failed to update job type:", error);
    }
  };

  const handleFollowUpDateChange = async (date) => {
    setFollowUpDate(date);

    try {
      await updateChat({
        id: chat._id,
        updates: { followUpDate: date },
      }).unwrap();

      onUpdate("followUpDate", date);
    } catch (error) {
      console.error("Failed to update follow-up date:", error);
    }
  };

  const handleFollowUpIntervalChange = async (e) => {
    const newInterval = parseInt(e.target.value, 10);
    setFollowUpInterval(newInterval);

    try {
      await updateChat({
        id: chat._id,
        updates: { followUpInterval: newInterval },
      }).unwrap();

      onUpdate("followUpInterval", newInterval);
    } catch (error) {
      console.error("Failed to update follow-up interval:", error);
    }
  };

  return (
    <div className="w-72 bg-gray-50 border-l border-gray-200 h-full overflow-y-auto p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-200">
        Chat Details
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Platform
        </label>
        <div className="bg-gray-100 px-3 py-2 rounded text-gray-700">
          {chat.platform?.name || "Unknown"}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Account
        </label>
        <div className="bg-gray-100 px-3 py-2 rounded text-gray-700">
          {chat.platformAccount?.username || "Unknown"}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Job Type
        </label>
        <select
          value={jobTypeId}
          onChange={handleJobTypeChange}
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Job Type</option>
          {jobTypes?.map((type) => (
            <option key={type._id} value={type._id}>
              {type.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="active">Active</option>
          <option value="to archive">To Archive</option>
          <option value="working on poc">Working on POC</option>
          <option value="starred">Starred</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Follow Up Date
        </label>
        <DatePicker
          selected={followUpDate}
          onChange={handleFollowUpDateChange}
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Follow Up Interval (days)
        </label>
        <select
          value={followUpInterval}
          onChange={handleFollowUpIntervalChange}
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="1">1 day</option>
          <option value="2">2 days</option>
          <option value="3">3 days</option>
          <option value="5">5 days</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          onBlur={handleNotesBlur}
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-24"
          placeholder="Add notes about this candidate..."
          rows={5}
        />
      </div>

      {chat.jobPosting && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Job Posting
          </label>
          <div className="bg-gray-100 px-3 py-2 rounded">
            <a
              href={`/job-postings/${chat.jobPosting._id}`}
              className="text-blue-500 hover:underline"
            >
              {chat.jobPosting.title}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
