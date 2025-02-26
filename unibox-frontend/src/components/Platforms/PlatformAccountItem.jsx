// File: src/components/Platforms/PlatformAccountItem.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updatePlatformAccount,
  deletePlatformAccount,
} from "../../redux/actions/accountActions";
import { formatDate } from "../../utils/dateUtils";
import "./PlatformAccountItem.css";

const PlatformAccountItem = ({ account, platform }) => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(account.username);
  const [password, setPassword] = useState(""); // Don't show actual password

  const handleToggleActive = () => {
    dispatch(
      updatePlatformAccount(account._id, {
        active: !account.active,
      })
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the account "${account.username}"?`
      )
    ) {
      dispatch(deletePlatformAccount(account._id));
    }
    setShowOptions(false);
  };

  const handleSaveEdit = () => {
    dispatch(
      updatePlatformAccount(account._id, {
        username,
        ...(password ? { password } : {}),
      })
    );
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setUsername(account.username);
    setPassword("");
    setIsEditing(false);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // Count number of chats associated with this account
  const chatCount = account.chatCount || 0;

  return (
    <div
      className={`platform-account-item ${!account.active ? "inactive" : ""}`}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="form-control"
            />
          </div>

          <div className="form-actions">
            <button className="cancel-button" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button className="save-button" onClick={handleSaveEdit}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="account-header">
            <h4 className="account-username">{account.username}</h4>
            <button className="options-button" onClick={toggleOptions}>
              ⋮
            </button>

            {showOptions && (
              <div className="account-options">
                <div className="option" onClick={handleEdit}>
                  Edit
                </div>
                <div className="option" onClick={handleToggleActive}>
                  {account.active ? "Deactivate" : "Activate"}
                </div>
                <div className="option delete" onClick={handleDelete}>
                  Delete
                </div>
              </div>
            )}
          </div>

          <div className="account-info">
            <div className="info-item">
              <span className="label">Status:</span>
              <span
                className={`value status-${
                  account.active ? "active" : "inactive"
                }`}
              >
                {account.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="info-item">
              <span className="label">Chats:</span>
              <span className="value">{chatCount}</span>
            </div>

            <div className="info-item">
              <span className="label">Last Sync:</span>
              <span className="value">
                {account.lastSync
                  ? formatDate(account.lastSync, "MMM d, yyyy")
                  : "Never"}
              </span>
            </div>
          </div>

          <button className="sync-button">Sync Now</button>
        </>
      )}
    </div>
  );
};

export default PlatformAccountItem;
