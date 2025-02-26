import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = ({ collapsed }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user.role === "admin";

  const [platformsOpen, setPlatformsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const togglePlatforms = () => {
    setPlatformsOpen(!platformsOpen);
  };

  const toggleAdmin = () => {
    setAdminOpen(!adminOpen);
  };

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <h1 className={`text-xl font-bold ${collapsed ? "hidden" : "block"}`}>
          CRM Chat
        </h1>
        <h1 className={`text-xl font-bold ${collapsed ? "block" : "hidden"}`}>
          CRM
        </h1>
      </div>

      <nav className="mt-5 px-2">
        <NavLink
          to="/unibox"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 mt-1 rounded-md ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {!collapsed && <span className="ml-3">Unibox</span>}
        </NavLink>

        <NavLink
          to="/job-planning"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 mt-1 rounded-md ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          {!collapsed && <span className="ml-3">Job Planning</span>}
        </NavLink>

        {/* Platforms dropdown */}
        <div className="mt-1">
          <button
            className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md focus:outline-none"
            onClick={togglePlatforms}
          >
            <div className="flex items-center">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              {!collapsed && (
                <>
                  <span className="ml-3">Platforms</span>
                  <svg
                    className={`ml-auto h-5 w-5 transform ${
                      platformsOpen ? "rotate-90" : ""
                    } transition-transform duration-200`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </div>
          </button>

          {(!collapsed || platformsOpen) && (
            <div
              className={`${
                platformsOpen ? "block" : collapsed ? "block" : "hidden"
              } pl-${collapsed ? "0" : "7"} mt-1`}
            >
              <NavLink
                to="/platforms/upwork"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                {collapsed ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ) : (
                  <span>Upwork Proposals</span>
                )}
              </NavLink>

              <NavLink
                to="/platforms/accounts"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                {collapsed ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ) : (
                  <span>Accounts</span>
                )}
              </NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 mt-1 rounded-md ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          {!collapsed && <span className="ml-3">Analytics</span>}
        </NavLink>

        {/* Admin section - only visible for admin users */}
        {isAdmin && (
          <div className="mt-1">
            <button
              className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md focus:outline-none"
              onClick={toggleAdmin}
            >
              <div className="flex items-center">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {!collapsed && (
                  <>
                    <span className="ml-3">Admin</span>
                    <svg
                      className={`ml-auto h-5 w-5 transform ${
                        adminOpen ? "rotate-90" : ""
                      } transition-transform duration-200`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </div>
            </button>

            {(!collapsed || adminOpen) && (
              <div
                className={`${
                  adminOpen ? "block" : collapsed ? "block" : "hidden"
                } pl-${collapsed ? "0" : "7"} mt-1`}
              >
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm rounded-md ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  {collapsed ? (
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <span>Users</span>
                  )}
                </NavLink>

                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm rounded-md ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  {collapsed ? (
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <span>Settings</span>
                  )}
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
