// ─────────────────────────────────────────────
//  src/components/Navbar.js
//
//  Responsive Bootstrap navbar.
//  Shows Login/Register when logged out.
//  Shows username + Logout when logged in.
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  // Re-check token on every route change so navbar updates instantly after login/logout
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container">
        {/* ── Brand ───────────────────────────── */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to={isLoggedIn ? "/dashboard" : "/login"}>
          <i className="bi bi-shield-lock-fill fs-5"></i>
          <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, letterSpacing: "-0.3px" }}>
            SecureAuth
          </span>
        </Link>

        {/* ── Mobile toggle ───────────────────── */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ── Nav links ───────────────────────── */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className="btn btn-outline-light btn-sm px-3"
                    to="/login"
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-light btn-sm px-3 text-primary fw-semibold"
                    to="/register"
                    style={{ color: "#1a237e" }}
                  >
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white-50" to="/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;