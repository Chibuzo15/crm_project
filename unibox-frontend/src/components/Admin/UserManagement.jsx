import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../store/userSlice";
import UserList from "./UserList";
import UserForm from "./UserForm";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const handleFormSubmit = (userData) => {
    if (selectedUser) {
      dispatch(updateUser({ userId: selectedUser._id, userData }));
    } else {
      dispatch(createUser(userData));
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          User Management
        </h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleCreateUser}
        >
          Add New User
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedUser ? "Edit User" : "Add New User"}
            </h3>
            <UserForm
              user={selectedUser}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {loading && !users.length ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <UserList
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
