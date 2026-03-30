// ─────────────────────────────────────────────
//  src/pages/Dashboard.js
//
//  Protected page — only accessible when logged in.
//  App.js wraps this in <PrivateRoute> which checks
//  for a JWT in localStorage before rendering.
//
//  Fetches the user's profile from the API on mount.
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile } from "../services/api";

function Dashboard() {
  const navigate        = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // ── Fetch profile on mount ─────────────────
  // GET /api/user/profile — the Axios interceptor automatically
  // attaches the stored Bearer token to this request.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setUser(data.user);
      } catch (err) {
        // 401 means token is invalid or expired
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ── Loading state ─────────────────────────
  if (loading) {
    return (
      <div className="auth-page">
        <div className="text-center">
          <div
            className="spinner-border"
            style={{ width: 48, height: 48, color: "#1a237e", borderWidth: 4 }}
            role="status"
          >
            <span className="visually-hidden">Loading…</span>
          </div>
          <p className="text-muted mt-3">Loading your profile…</p>
        </div>
      </div>
    );
  }

  // ── Main dashboard ────────────────────────
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">

            {/* Success banner */}
            <div
              className="auth-card text-center mb-4 fade-in-up"
              style={{ background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)", color: "#fff" }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <i className="bi bi-person-check-fill" style={{ fontSize: "2rem", color: "#fff" }}></i>
              </div>
              <h3 className="fw-bold mb-1">Welcome back!</h3>
              <p style={{ opacity: 0.8, fontSize: "0.95rem", marginBottom: 0 }}>
                You are successfully logged in.
              </p>
            </div>

            {/* Profile card */}
            <div className="auth-card fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h5
                className="fw-bold mb-4 d-flex align-items-center gap-2"
                style={{ color: "#1a237e" }}
              >
                <i className="bi bi-person-circle fs-4"></i>
                Your Profile
              </h5>

              {user && (
                <>
                  {/* Avatar initials */}
                  <div className="text-center mb-4">
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#1a237e,#3949ab)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: "#fff",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <p className="mt-2 mb-0 fw-semibold" style={{ fontSize: "1.1rem", color: "#1a237e" }}>
                      {user.username}
                    </p>
                  </div>

                  {/* Profile fields */}
                  <div className="profile-field">
                    <i className="bi bi-person"></i>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#90a4ae", marginBottom: 2 }}>Username</div>
                      <div className="fw-semibold">{user.username}</div>
                    </div>
                  </div>

                  <div className="profile-field">
                    <i className="bi bi-envelope"></i>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#90a4ae", marginBottom: 2 }}>Email</div>
                      <div className="fw-semibold">{user.email}</div>
                    </div>
                  </div>

                  <div className="profile-field">
                    <i className="bi bi-calendar3"></i>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#90a4ae", marginBottom: 2 }}>Member Since</div>
                      <div className="fw-semibold">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="profile-field">
                    <i className="bi bi-shield-check" style={{ color: "#42b72a" }}></i>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#90a4ae", marginBottom: 2 }}>
                        Account Status
                      </div>
                      <div className="fw-semibold" style={{ color: "#42b72a" }}>
                        Active &amp; Verified
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="d-flex gap-2 mt-4 flex-wrap">
                <Link
                  to="/forgot-password"
                  className="btn btn-outline-primary flex-fill"
                  style={{ borderRadius: 10, fontWeight: 500 }}
                >
                  <i className="bi bi-key me-2"></i>
                  Change Password
                </Link>
                <button
                  className="btn btn-outline-danger flex-fill"
                  style={{ borderRadius: 10, fontWeight: 500 }}
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;