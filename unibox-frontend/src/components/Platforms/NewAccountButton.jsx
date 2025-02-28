import React from "react";

// No changes needed for this component since it's just a button that calls an onClick handler
const NewAccountButton = ({ onClick }) => {
  return (
    // Original JSX structure
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Add Account
    </button>
  );
};

export default NewAccountButton;
