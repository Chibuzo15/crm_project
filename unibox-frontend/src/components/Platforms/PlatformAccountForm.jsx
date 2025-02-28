import React, { useState, useEffect } from "react";
import {
  useGetPlatformsQuery,
  useCreatePlatformAccountMutation,
  useUpdatePlatformAccountMutation,
} from "../../store/api";

const PlatformAccountForm = ({ account = null, onSave, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    platformId: "",
    username: "",
    password: "",
    accessToken: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Get platforms for dropdown
  const { data: platforms, isLoading: platformsLoading } =
    useGetPlatformsQuery();

  // RTK Query mutations
  const [createAccount, { isLoading: isCreating }] =
    useCreatePlatformAccountMutation();
  const [updateAccount, { isLoading: isUpdating }] =
    useUpdatePlatformAccountMutation();

  // Determine if we're in edit mode
  const isEditMode = !!account;
  const isLoading = isCreating || isUpdating;

  // Populate form data if editing an account
  useEffect(() => {
    if (account) {
      setFormData({
        platformId: account.platformId || "",
        username: account.username || "",
        password: account.password ? "********" : "", // Don't show actual password
        accessToken: account.accessToken || "",
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.platformId) {
      newErrors.platformId = "Platform is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Only require password for new accounts
    if (!isEditMode && !formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Clean up form data
      const dataToSubmit = { ...formData };

      // Don't send password if it's the masked placeholder
      if (isEditMode && formData.password === "********") {
        delete dataToSubmit.password;
      }

      // Remove empty access token
      if (!dataToSubmit.accessToken) {
        delete dataToSubmit.accessToken;
      }

      let result;

      if (isEditMode) {
        // Update existing account
        result = await updateAccount({
          id: account._id,
          accountData: dataToSubmit,
        }).unwrap();
      } else {
        // Create new account
        result = await createAccount(dataToSubmit).unwrap();
      }

      if (onSave) {
        onSave(result);
      }
    } catch (err) {
      console.error("Error saving account:", err);
      setErrors({
        submit:
          err.data?.message || "Failed to save account. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-50 p-3 rounded text-red-700 text-sm">
          {errors.submit}
        </div>
      )}

      <div>
        <label
          htmlFor="platformId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Platform
        </label>
        <select
          id="platformId"
          name="platformId"
          value={formData.platformId}
          onChange={handleChange}
          disabled={isLoading || isEditMode} // Can't change platform in edit mode
          className={`mt-1 block w-full rounded-md border ${
            errors.platformId ? "border-red-300" : "border-gray-300"
          } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            isLoading || isEditMode ? "bg-gray-100" : ""
          }`}
        >
          <option value="">Select Platform</option>
          {platforms &&
            platforms.map((platform) => (
              <option key={platform._id} value={platform._id}>
                {platform.name}
              </option>
            ))}
        </select>
        {errors.platformId && (
          <p className="mt-1 text-sm text-red-600">{errors.platformId}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md border ${
            errors.username ? "border-red-300" : "border-gray-300"
          } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            isLoading ? "bg-gray-100" : ""
          }`}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password{" "}
          {isEditMode && (
            <span className="text-gray-500 font-normal">
              (leave unchanged if not updating)
            </span>
          )}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className={`mt-1 block w-full rounded-md border ${
              errors.password ? "border-red-300" : "border-gray-300"
            } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              isLoading ? "bg-gray-100" : ""
            }`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
          >
            {showPassword ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="accessToken"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Access Token{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          id="accessToken"
          name="accessToken"
          value={formData.accessToken}
          onChange={handleChange}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md border ${
            errors.accessToken ? "border-red-300" : "border-gray-300"
          } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            isLoading ? "bg-gray-100" : ""
          }`}
        />
        {errors.accessToken && (
          <p className="mt-1 text-sm text-red-600">{errors.accessToken}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : isEditMode ? (
            "Update Account"
          ) : (
            "Add Account"
          )}
        </button>
      </div>
    </form>
  );
};

export default PlatformAccountForm;
