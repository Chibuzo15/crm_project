import React, { useState } from "react";
import { useGetUsersQuery, useDeleteUserMutation } from "../../store/api";
import { useDispatch } from "react-redux";
import { prepareUserFormForEdit, setUserFormMode } from "../../store/userSlice";

const UserList = ({ onEditUser }) => {
  const dispatch = useDispatch();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Use RTK Query hook instead of useSelector and useEffect
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery();

  // Use RTK Query mutation hook instead of dispatch(deleteUser())
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleEditUser = (user) => {
    // Use the action from userSlice to prepare the form for editing
    dispatch(prepareUserFormForEdit(user));
    dispatch(setUserFormMode("edit"));

    if (onEditUser) {
      onEditUser(user);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete._id).unwrap();
        setShowConfirmDelete(false);
        setUserToDelete(null);
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setUserToDelete(null);
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error loading users: {error.message || "Unknown error"}
        <button
          onClick={refetch}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Role</th>
            <th className="py-2 px-4 border-b text-left">
              Max Response Time (h)
            </th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  {user.maxResponseTime || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {users && users.length === 0 && (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete user '{userToDelete?.name}'? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
