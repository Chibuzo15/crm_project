// File: src/components/Platforms/NewAccountButton.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPlatformAccount } from "../../redux/actions/accountActions";
import "./NewAccountButton.css";

const NewAccountButton = ({ platform }) => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    dispatch(
      createPlatformAccount({
        platform: platform._id,
        username,
        password,
        active: true,
      })
    );

    // Reset form and close
    setUsername("");
    setPassword("");
    setError("");
    setShowForm(false);
  };

  return (
    <div className="new-account-container">
      {showForm ? (
        <div className="new-account-form">
          <h4>Add {platform.name} Account</h4>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
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
                className="form-control"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Add Account
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="new-account-button" onClick={() => setShowForm(true)}>
          <span className="plus-icon">+</span>
          <span>Add {platform.name} Account</span>
        </div>
      )}
    </div>
  );
};

export default NewAccountButton;
