// File: src/components/Layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user.role === "admin";

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">{collapsed ? "CRM" : "CRM Chat"}</div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/unibox"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="icon-chat"></i>
              <span className="nav-text">Unibox</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/job-planning"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="icon-job"></i>
              <span className="nav-text">Job Planning</span>
            </NavLink>
          </li>

          <li className="nav-dropdown">
            <div className="nav-dropdown-heading">
              <i className="icon-platform"></i>
              <span className="nav-text">Platforms</span>
            </div>

            <ul className="sub-menu">
              <li>
                <NavLink
                  to="/platforms/upwork"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-text">Upwork Proposals</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/platforms/accounts"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-text">Accounts</span>
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="icon-analytics"></i>
              <span className="nav-text">Analytics</span>
            </NavLink>
          </li>

          {isAdmin && (
            <li className="nav-dropdown">
              <div className="nav-dropdown-heading">
                <i className="icon-admin"></i>
                <span className="nav-text">Admin</span>
              </div>

              <ul className="sub-menu">
                <li>
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <span className="nav-text">Users</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/settings"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <span className="nav-text">Settings</span>
                  </NavLink>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
