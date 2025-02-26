import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPlatformAccount } from "../../store/accountSlice";

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
    <div>
      {showForm ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-3">
            Add {platform.name} Account
          </h4>

          {error && (
            <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-2">
                <button
                  type="button"
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Account
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div
          className="border border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer h-full min-h-[180px] hover:bg-gray-50 transition-colors"
          onClick={() => setShowForm(true)}
        >
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <span className="text-blue-600 font-medium">
              Add {platform.name} Account
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAccountButton;
