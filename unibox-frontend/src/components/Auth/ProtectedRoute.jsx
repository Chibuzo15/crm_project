import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "../../store/api";

import Layout from "../Layout/Layout";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // Skip the query if there's no token - no need to make API call
  const { isLoading, isError } = useGetCurrentUserQuery(undefined, {
    // Skip the API call if no token exists
    skip: !token,
    // Use pollingInterval if you want to periodically check authentication
    // pollingInterval: 300000, // 5 minutes
  });

  // If we're still waiting for the auth check, show a loading screen
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated or auth check failed, redirect to login
  if (!isAuthenticated || isError) {
    return <Navigate to="/login" />;
  }

  // If authentication successful, render the child routes
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
