// ─────────────────────────────────────────────
//  src/pages/ResetPassword.js  —  Flow 2
//
//  This page is opened when the user clicks the
//  link in their email:
//    http://localhost:3000/reset-password/:token
//
//  Step 1 (on mount):  verify token is valid & not expired
//  Step 2 (on submit): send new password to backend
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../services/api";
import Alert from "../components/Alert";
import PasswordStrength from "../components/PasswordStrength";

// Token states this page can be in
const TOKEN_STATE = {
  CHECKING: "checking",   // verifying with backend — show spinner
  VALID:    "valid",      // token OK — show password form
  INVALID:  "invalid",    // token bad / expired — show error screen
};

function ResetPassword() {
  const { token }  = useParams();   // raw token from URL
  const navigate   = useNavigate();

  // ── State ─────────────────────────────────
  const [tokenState, setTokenState] = useState(TOKEN_STATE.CHECKING);
  const [tokenEmail, setTokenEmail] = useState(""); // email from token verification
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [alert, setAlert]       = useState({ type: "", message: "" });
  const [success, setSuccess]   = useState(false); // show success screen after reset

  // ── Step 1: Verify token on page load ─────
  // Called automatically when the user lands on this page from the email link.
  // Hits GET /api/auth/verify-token/:token
  // If token is valid → show the password form
  // If token is invalid or expired → show the error screen
  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await verifyResetToken(token);
        setTokenEmail(data.email || "");
        setTokenState(TOKEN_STATE.VALID);
      } catch (err) {
        // Token not found in DB or resetTokenExpire < now
        setAlert({
          type: "danger",
          message:
            err.response?.data?.message ||
            "This password reset link is invalid or has expired.",
        });
        setTokenState(TOKEN_STATE.INVALID);
      }
    };

    if (token) {
      verify();
    } else {
      setTokenState(TOKEN_STATE.INVALID);
      setAlert({ type: "danger", message: "No reset token found in the URL." });
    }
  }, [token]);

  // ── Handlers ──────────────────────────────
  const handleChange = (e) => {
    setAlert({ type: "", message: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── Step 2: Submit new password ───────────
  // Hits POST /api/auth/reset-password/:token
  // Backend hashes the URL token, finds the matching DB record,
  // checks expiry again, then sets the new password and clears the token.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (form.password.length < 6) {
      return setAlert({ type: "danger", message: "Password must be at least 6 characters." });
    }
    if (form.password !== form.confirmPassword) {
      return setAlert({ type: "danger", message: "Passwords do not match." });
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const { data } = await resetPassword(token, form.password, form.confirmPassword);

      // Backend returns a fresh JWT — log the user in immediately
      localStorage.setItem("token", data.token);
      setSuccess(true);

      // Redirect to dashboard after 2.5 seconds
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      // Could mean token expired between verify and submit (race condition)
      setAlert({
        type: "danger",
        message:
          err.response?.data?.message ||
          "Password reset failed. The link may have expired — please request a new one.",
      });
      // If the token expired, switch to the invalid screen
      if (err.response?.status === 400) {
        setTokenState(TOKEN_STATE.INVALID);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────

  // ── Spinner: verifying token ──────────────
  if (tokenState === TOKEN_STATE.CHECKING) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <div className="auth-card text-center fade-in-up">
                <div
                  className="spinner-border mb-4"
                  style={{ width: 52, height: 52, color: "#1a237e", borderWidth: 4 }}
                  role="status"
                >
                  <span className="visually-hidden">Verifying…</span>
                </div>
                <h5 className="fw-semibold mb-1" style={{ color: "#1a237e" }}>
                  Verifying your link…
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.88rem" }}>
                  Checking the reset token with our server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Success screen: password was reset ────
  if (success) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <div className="auth-card text-center fade-in-up">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#e8f5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  <i
                    className="bi bi-check-lg"
                    style={{ fontSize: "2.5rem", color: "#2e7d32" }}
                  ></i>
                </div>
                <h4 className="fw-bold mb-2" style={{ color: "#1b5e20" }}>
                  Password Reset!
                </h4>
                <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                  Your password has been updated successfully.
                  You're now logged in and will be redirected shortly.
                </p>
                <div className="progress" style={{ height: 5, borderRadius: 3 }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: "100%",
                      background: "#2e7d32",
                      animation: "shrink 2.5s linear forwards",
                    }}
                  ></div>
                </div>
                <style>{`
                  @keyframes shrink {
                    from { width: 100%; }
                    to   { width: 0%; }
                  }
                `}</style>
                <p className="mt-2 mb-0" style={{ fontSize: "0.8rem", color: "#90a4ae" }}>
                  Redirecting to dashboard…
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Invalid / expired token screen ────────
  if (tokenState === TOKEN_STATE.INVALID) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <div className="auth-card text-center fade-in-up">
                <div className="auth-icon-circle" style={{ background: "linear-gradient(135deg,#c62828,#e53935)" }}>
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h4 className="fw-bold mb-2" style={{ color: "#b71c1c" }}>
                  Link Expired or Invalid
                </h4>
                <Alert type={alert.type} message={alert.message} />
                <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                  Password reset links expire after{" "}
                  <strong>10 minutes</strong> for security. Please request a
                  fresh link below.
                </p>
                <Link
                  to="/forgot-password"
                  className="btn-primary-custom text-decoration-none d-inline-block"
                  style={{ padding: "0.7rem 1.5rem", borderRadius: 10 }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Request New Reset Link
                </Link>
                <p className="mt-3 mb-0" style={{ fontSize: "0.88rem" }}>
                  <Link to="/login">
                    <i className="bi bi-arrow-left me-1"></i>Back to Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form: token is valid ─────────────
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="auth-card fade-in-up">

              {/* Header */}
              <div className="text-center mb-4">
                <div className="auth-icon-circle">
                  <i className="bi bi-key-fill"></i>
                </div>
                <h2 className="fw-bold mb-1" style={{ color: "#1a237e" }}>
                  Set New Password
                </h2>
                {tokenEmail && (
                  <p className="text-muted mb-0" style={{ fontSize: "0.88rem" }}>
                    Resetting password for{" "}
                    <strong style={{ color: "#3949ab" }}>{tokenEmail}</strong>
                  </p>
                )}
              </div>

              {/* Expiry reminder banner */}
              <div
                className="alert alert-warning d-flex align-items-center gap-2 mb-3"
                style={{ borderRadius: 12, fontSize: "0.85rem" }}
              >
                <i className="bi bi-clock-history flex-shrink-0"></i>
                <span>
                  This link expires in <strong>10 minutes</strong> from when you
                  requested it.
                </span>
              </div>

              <Alert type={alert.type} message={alert.message} />

              <form onSubmit={handleSubmit} noValidate>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    New Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }}
                      onClick={() => setShowPass(!showPass)}
                      tabIndex={-1}
                    >
                      <i className={`bi bi-eye${showPass ? "-slash" : ""}`}></i>
                    </button>
                  </div>
                  {/* Live strength indicator */}
                  <PasswordStrength password={form.password} />
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    Confirm New Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Repeat your new password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  {/* Live match feedback */}
                  {form.password && form.confirmPassword && (
                    <div
                      className="mt-1"
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color:
                          form.password === form.confirmPassword
                            ? "#42b72a"
                            : "#ef5350",
                      }}
                    >
                      <i
                        className={`bi bi-${
                          form.password === form.confirmPassword
                            ? "check-circle"
                            : "x-circle"
                        } me-1`}
                      ></i>
                      {form.password === form.confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary-custom"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Resetting password…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      Reset Password
                    </>
                  )}
                </button>
              </form>

              <p className="text-center mt-3 mb-0" style={{ fontSize: "0.88rem" }}>
                <Link to="/forgot-password">
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Request a new link
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;