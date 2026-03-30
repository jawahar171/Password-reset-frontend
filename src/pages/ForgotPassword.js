// ─────────────────────────────────────────────
//  src/pages/ForgotPassword.js  —  Flow 1
//
//  User enters their email address.
//  Backend checks if it exists in DB:
//    ✓ Found → generates random token, emails reset link
//    ✗ Not found → returns error message (shown below)
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";
import Alert from "../components/Alert";

function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]   = useState({ type: "", message: "" });
  // Once the email is sent successfully, we show a confirmation screen
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return setAlert({ type: "danger", message: "Please enter your email address." });
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const { data } = await forgotPassword(email);
      // Flow 1 success: email sent
      setEmailSent(true);
      setAlert({ type: "success", message: data.message });
    } catch (err) {
      // Flow 1 failure: user not found or server error
      setAlert({
        type: "danger",
        message: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="auth-card fade-in-up">

              {/* Header */}
              <div className="text-center mb-4">
                <div className="auth-icon-circle">
                  <i className={`bi bi-${emailSent ? "envelope-check-fill" : "envelope-open-fill"}`}></i>
                </div>
                <h2 className="fw-bold mb-1" style={{ color: "#1a237e" }}>
                  {emailSent ? "Check Your Email" : "Forgot Password?"}
                </h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {emailSent
                    ? "We've sent a reset link to your inbox."
                    : "Enter your email and we'll send you a reset link."}
                </p>
              </div>

              {/* Alert — shows both success and error */}
              <Alert type={alert.type} message={alert.message} />

              {/* ── Success State ─────────────────────── */}
              {emailSent ? (
                <div className="text-center">
                  {/* Visual confirmation */}
                  <div
                    style={{
                      background: "#e8f5e9",
                      border: "1.5px solid #a5d6a7",
                      borderRadius: 14,
                      padding: "1.5rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <i
                      className="bi bi-send-check-fill"
                      style={{ fontSize: "2.5rem", color: "#2e7d32", display: "block", marginBottom: 10 }}
                    ></i>
                    <p className="mb-1 fw-semibold" style={{ color: "#1b5e20" }}>
                      Reset link sent to:
                    </p>
                    <p className="mb-0" style={{ color: "#2e7d32", wordBreak: "break-all" }}>
                      <strong>{email}</strong>
                    </p>
                  </div>

                  {/* Expiry reminder */}
                  <div
                    className="alert alert-warning"
                    style={{ borderRadius: 12, fontSize: "0.85rem", textAlign: "left" }}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    The reset link expires in <strong>10 minutes</strong>. Check your spam folder if you don't see it.
                  </div>

                  {/* Resend option */}
                  <button
                    className="btn btn-outline-primary btn-sm mt-1"
                    onClick={() => {
                      setEmailSent(false);
                      setAlert({ type: "", message: "" });
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Send again with different email
                  </button>
                </div>
              ) : (
                /* ── Email Input Form (Flow 1) ──────── */
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setAlert({ type: "", message: "" });
                        }}
                        required
                        autoFocus
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-text">
                      We'll send a one-time reset link to this address.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-custom"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Sending link…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Back to login */}
              <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                <Link to="/login">
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;