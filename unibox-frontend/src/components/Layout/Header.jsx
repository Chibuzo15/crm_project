// File: src/components/Layout/Header.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import "./Header.css";

const Header = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <i className="icon-menu"></i>
        </button>
      </div>

      <div className="header-right">
        <div className="notifications">
          <button className="notification-button">
            <i className="icon-notification"></i>
            <span className="notification-badge">3</span>
          </button>
        </div>

        <div className="user-dropdown">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="dropdown-menu">
            <div className="dropdown-item">Profile</div>
            <div className="dropdown-item">Settings</div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
