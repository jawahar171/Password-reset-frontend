// ═══════════════════════════════════════════════
//  src/App.js  —  Root Component with Routing
// ═══════════════════════════════════════════════
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Navbar      from "./components/Navbar";
import Register    from "./pages/Register";
import Login       from "./pages/Login";
import ForgotPassword  from "./pages/ForgotPassword";
import ResetPassword   from "./pages/ResetPassword";
import Dashboard   from "./pages/Dashboard";

// ── PrivateRoute ──────────────────────────────
// Wraps any route that needs the user to be logged in.
// If no token in localStorage → redirect to /login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/"                  element={<Navigate to="/login" replace />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/forgot-password"   element={<ForgotPassword />} />
        {/* :token is the random string from the email link */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;