import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateChat } from "../../redux/actions/chatActions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ChatSidebar.css";

const ChatSidebar = ({ chat, onUpdate }) => {
  const dispatch = useDispatch();
  const { jobTypes } = useSelector((state) => state.jobType);
  const { platforms } = useSelector((state) => state.platform);

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

  const handleNotesBlur = () => {
    if (notes !== chat.notes) {
      dispatch(updateChat(chat._id, { notes }));
      onUpdate("notes", notes);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    dispatch(updateChat(chat._id, { status: newStatus }));
    onUpdate("status", newStatus);
  };

  const handleJobTypeChange = (e) => {
    const newJobTypeId = e.target.value;
    setJobTypeId(newJobTypeId);
    dispatch(updateChat(chat._id, { jobType: newJobTypeId }));
    onUpdate("jobType", newJobTypeId);
  };

  const handleFollowUpDateChange = (date) => {
    setFollowUpDate(date);
    dispatch(updateChat(chat._id, { followUpDate: date }));
    onUpdate("followUpDate", date);
  };

  const handleFollowUpIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value, 10);
    setFollowUpInterval(newInterval);
    dispatch(updateChat(chat._id, { followUpInterval: newInterval }));
    onUpdate("followUpInterval", newInterval);
  };

  return (
    <div className="chat-sidebar">
      <h3 className="sidebar-title">Chat Details</h3>

      <div className="sidebar-section">
        <label>Platform</label>
        <div className="field-value">{chat.platform?.name || "Unknown"}</div>
      </div>

      <div className="sidebar-section">
        <label>Account</label>
        <div className="field-value">
          {chat.platformAccount?.username || "Unknown"}
        </div>
      </div>

      <div className="sidebar-section">
        <label>Job Type</label>
        <select
          value={jobTypeId}
          onChange={handleJobTypeChange}
          className="form-select"
        >
          <option value="">Select Job Type</option>
          {jobTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.title}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <label>Status</label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="form-select"
        >
          <option value="active">Active</option>
          <option value="to archive">To Archive</option>
          <option value="working on poc">Working on POC</option>
          <option value="starred">Starred</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="sidebar-section">
        <label>Follow Up Date</label>
        <DatePicker
          selected={followUpDate}
          onChange={handleFollowUpDateChange}
          className="form-input"
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div className="sidebar-section">
        <label>Follow Up Interval (days)</label>
        <select
          value={followUpInterval}
          onChange={handleFollowUpIntervalChange}
          className="form-select"
        >
          <option value="1">1 day</option>
          <option value="2">2 days</option>
          <option value="3">3 days</option>
          <option value="5">5 days</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
        </select>
      </div>

      <div className="sidebar-section">
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          onBlur={handleNotesBlur}
          className="form-textarea"
          placeholder="Add notes about this candidate..."
          rows={5}
        />
      </div>

      {chat.jobPosting && (
        <div className="sidebar-section">
          <label>Job Posting</label>
          <div className="job-posting-link">
            <a href={`/job-postings/${chat.jobPosting._id}`}>
              {chat.jobPosting.title}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
