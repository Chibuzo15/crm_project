import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = (props) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuToggle={toggleSidebar} />

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">{props.children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
