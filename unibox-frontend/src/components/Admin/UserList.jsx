// File: src/components/Admin/UserList.jsx
import React from "react";
import { formatDate } from "../../utils/dateUtils";
import "./UserList.css";

const UserList = ({ users, onEdit, onDelete }) => {
  if (users.length === 0) {
    return (
      <div className="no-users-message">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Max Response Time (hrs)</th>
            <th>Last Active</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className="user-role">{user.role}</td>
              <td className="text-center">{user.maxResponseTime}</td>
              <td>{formatDate(user.lastActive, "MMM d, yyyy")}</td>
              <td>{formatDate(user.createdAt, "MMM d, yyyy")}</td>
              <td className="actions-cell">
                <button className="edit-button" onClick={() => onEdit(user)}>
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(user._id)}
                  disabled={user.role === "admin"}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
