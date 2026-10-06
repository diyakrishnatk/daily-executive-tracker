import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import AddActivity from "./pages/AddActivity";
import ActivityHistory from "./pages/ActivityHistory";
import EditActivity from "./pages/EditActivity";
import AdminDashboard from "./pages/AdminDashboard";
import AdminExecutives from "./pages/AdminExecutives";
import AdminActivities from "./pages/AdminActivities";

// Public route wrapper (redirect logged in users to appropriate home)
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (token) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/"} replace />;
  }
  return children;
}

// Protected route wrapper
function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (!requireAdmin && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Executive routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ExecutiveDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-activity"
          element={
            <ProtectedRoute>
              <AddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-history"
          element={
            <ProtectedRoute>
              <ActivityHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-activity"
          element={
            <ProtectedRoute>
              <EditActivity />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/executives"
          element={
            <ProtectedRoute requireAdmin>
              <AdminExecutives />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/activities"
          element={
            <ProtectedRoute requireAdmin>
              <AdminActivities />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;