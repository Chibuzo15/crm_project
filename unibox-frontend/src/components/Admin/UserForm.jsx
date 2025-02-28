import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
} from "../../store/api";
import {
  setUserFormData,
  resetUserForm,
  setUserFormErrors,
} from "../../store/userSlice";

const UserForm = ({ user, onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const { userFormData, userFormMode, selectedUserId, userFormErrors } =
    useSelector((state) => state.user);
  const [validationErrors, setValidationErrors] = useState({});

  // Replace thunks with RTK Query mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Get user data for editing if needed
  const { data: userData } = useGetUserByIdQuery(selectedUserId, {
    // Skip query if not in edit mode or no ID
    skip: userFormMode !== "edit" || !selectedUserId,
  });

  // Fill form with user data if in edit mode
  useEffect(() => {
    if (userFormMode === "edit" && userData) {
      dispatch(
        setUserFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          maxResponseTime: userData.maxResponseTime || 8,
        })
      );
    }
  }, [userData, userFormMode, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      setUserFormData({
        ...userFormData,
        [name]: value,
      })
    );
  };

  const validateForm = () => {
    // Keep original validation logic
    const errors = {};

    if (!userFormData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!userFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      errors.email = "Email is invalid";
    }

    if (userFormMode === "create" && !userFormData.password) {
      errors.password = "Password is required";
    } else if (userFormMode === "create" && userFormData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(setUserFormErrors(null));

    if (!validateForm()) {
      return;
    }

    try {
      if (userFormMode === "create") {
        // Use RTK Query mutation instead of createUser thunk
        await createUser(userFormData).unwrap();
      } else {
        // Use RTK Query mutation instead of updateUser thunk
        await updateUser({
          id: selectedUserId,
          userData: userFormData,
        }).unwrap();
      }

      dispatch(resetUserForm());
      if (onCancel) onCancel();
    } catch (err) {
      // Error handling
      dispatch(setUserFormErrors(err.data?.message || "Failed to save user"));
      console.error("Error saving user:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-3 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 ${
            errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent`}
        />
        {errors.name && (
          <div className="mt-1 text-sm text-red-500">{errors.name}</div>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 ${
            errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent`}
        />
        {errors.email && (
          <div className="mt-1 text-sm text-red-500">{errors.email}</div>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {user ? "Password (leave blank to keep current)" : "Password *"}
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-3 py-2 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 ${
            errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent`}
        />
        {errors.password && (
          <div className="mt-1 text-sm text-red-500">{errors.password}</div>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="maxResponseTime"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Maximum Response Time (hours)
        </label>
        <input
          type="number"
          id="maxResponseTime"
          value={maxResponseTime}
          onChange={(e) => setMaxResponseTime(e.target.value)}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {user ? "Update" : "Create"} User
        </button>
      </div>
      {(isCreating || isUpdating) && <div> Submitting </div>}
    </form>
  );
};

export default UserForm;
