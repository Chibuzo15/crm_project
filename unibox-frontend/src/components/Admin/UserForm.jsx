// File: src/components/Admin/UserForm.jsx
import React, { useState } from "react";
import "./UserForm.css";

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role || "user");
  const [maxResponseTime, setMaxResponseTime] = useState(
    user?.maxResponseTime || 24
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!user && !password.trim()) {
      newErrors.password = "Password is required for new users";
    } else if (!user && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      name,
      email,
      role,
      maxResponseTime: parseInt(maxResponseTime, 10),
    };

    if (password) {
      userData.password = password;
    }

    onSubmit(userData);
  };

  return (
    <div className="user-form">
      <h3>{user ? "Edit User" : "Create User"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`form-control ${errors.name ? "error" : ""}`}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-control ${errors.email ? "error" : ""}`}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            {user ? "Password (leave blank to keep current)" : "Password *"}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${errors.password ? "error" : ""}`}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-control"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="maxResponseTime">Maximum Response Time (hours)</label>
          <input
            type="number"
            id="maxResponseTime"
            value={maxResponseTime}
            onChange={(e) => setMaxResponseTime(e.target.value)}
            min="1"
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {user ? "Update" : "Create"} User
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
