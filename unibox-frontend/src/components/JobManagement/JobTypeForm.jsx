import React, { useState } from "react";

const JobTypeForm = ({ jobType, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(jobType?.title || "");
  const [description, setDescription] = useState(jobType?.description || "");
  const [titleError, setTitleError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    // Submit the job type
    onSubmit({
      ...(jobType || {}),
      title,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError("");
          }}
          className={`w-full p-2 border rounded-md ${
            titleError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } focus:outline-none focus:ring-2 focus:border-transparent`}
          placeholder="e.g., Front-end Developer"
        />
        {titleError && (
          <div className="mt-1 text-sm text-red-500">{titleError}</div>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe this job type..."
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {jobType ? "Update" : "Create"} Job Type
        </button>
      </div>
    </form>
  );
};

export default JobTypeForm;
