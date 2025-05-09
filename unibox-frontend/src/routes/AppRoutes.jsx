import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";

// Layout
import Layout from "../components/Layout/Layout";

// Auth components
import Login from "../components/Auth/Login";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

// Main components
import Unibox from "../components/Unibox/Unibox";
import JobPlanningTool from "../components/JobManagement/JobPlanningTool";
import UpworkJobProposals from "../components/Platforms/UpworkJobProposals";
import PlatformAccountsList from "../components/Platforms/PlatformAccountsList";
import UserManagement from "../components/Admin/UserManagement";
import ActivityDashboard from "../components/Analytics/ActivityDashboard";
import NotFound from "../components/Common/NotFound";

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/unibox" /> : <Login />}
        />

        <Route path="/" element={<ProtectedRoute />}>
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

export default AppRoutes;
