import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import HomePage from "./pages/Homepage";
import EventDetail from "./pages/EventDetail";
import MyRegistrations from "./pages/MyRegistrations";
import AdminPage from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute"; // import it

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Only students can access homepage and myregistrations */}
          <Route
            path="/homepage"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myregistrations"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />

          {/* Only admins can access admin page */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Event details accessible to all logged-in users */}
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