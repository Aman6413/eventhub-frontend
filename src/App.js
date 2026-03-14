import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./store/slices/authSlice";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import HomePage from "./pages/Homepage";
import EventDetail from "./pages/EventDetail";
import AdminPage from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();

  // Initialize auth state on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/homepage"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* MyRegistrations page removed */}

          {/* Admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Event detail */}
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "student"]}>
                <EventDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
