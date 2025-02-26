// File: src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./redux/actions/authActions";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import Unibox from "./components/Unibox/Unibox";
import JobPlanningTool from "./components/JobManagement/JobPlanningTool";
import UpworkJobProposals from "./components/Platforms/UpworkJobProposals";
import PlatformAccountsList from "./components/Platforms/PlatformAccountsList";
import UserManagement from "./components/Admin/UserManagement";
import ActivityDashboard from "./components/Analytics/ActivityDashboard";
import NotFound from "./components/Common/NotFound";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/unibox" /> : <Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/unibox" />} />

          <Route path="unibox" element={<Unibox />} />
          <Route path="unibox/:chatId" element={<Unibox />} />

          <Route path="job-planning" element={<JobPlanningTool />} />

          <Route path="platforms">
            <Route path="upwork" element={<UpworkJobProposals />} />
            <Route path="accounts" element={<PlatformAccountsList />} />
          </Route>

          <Route path="analytics" element={<ActivityDashboard />} />

          <Route path="admin">
            <Route
              path="users"
              element={
                user && user.role === "admin" ? (
                  <UserManagement />
                ) : (
                  <Navigate to="/unibox" />
                )
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
