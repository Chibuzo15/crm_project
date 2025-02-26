import React, { useState } from "react";

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
    </form>
  );
};

export default UserForm;
