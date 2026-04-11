import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";
import Alert from "../components/Alert";

function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [alert, setAlert]     = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim())
      return setAlert({ type: "danger", message: "Please enter your email address." });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setAlert({ type: "danger", message: "Please enter a valid email address." });

    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setAlert({
        type: "danger",
        message: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <div className="auth-card fade-in-up text-center">
                <div className="auth-icon-circle" style={{ background: "#d1fae5" }}>
                  <i className="bi bi-envelope-check" style={{ color: "#065f46" }}></i>
                </div>
                <h2 className="fw-bold mb-2">Check Your Inbox</h2>
                <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                  If an account exists for <strong>{email}</strong>, a password reset link has been sent.
                  The link expires in <strong>1 hour</strong>.
                </p>
                <div className="alert alert-info d-flex align-items-start gap-2" style={{ fontSize: "0.85rem", textAlign: "left" }}>
                  <i className="bi bi-info-circle mt-1"></i>
                  <span>Didn't receive it? Check your spam folder, or <button className="btn btn-link p-0 align-baseline" style={{ fontSize: "0.85rem" }} onClick={() => setSent(false)}>try again</button>.</span>
                </div>
                <Link to="/login" className="btn-primary-custom" style={{ display: "block", textDecoration: "none", textAlign: "center" }}>
                  <i className="bi bi-arrow-left me-2"></i>Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="auth-card fade-in-up">

              <div className="text-center mb-4">
                <div className="auth-icon-circle">
                  <i className="bi bi-key-fill"></i>
                </div>
                <h2 className="fw-bold mb-1">Forgot Password?</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <Alert type={alert.type} message={alert.message} />

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email" className="form-control"
                      placeholder="you@example.com" value={email}
                      onChange={(e) => { setAlert({ type: "", message: "" }); setEmail(e.target.value); }}
                      required autoFocus autoComplete="email"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary-custom" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Sending…</>
                  ) : (
                    <><i className="bi bi-send me-2"></i>Send Reset Link</>
                  )}
                </button>
              </form>

              <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                <Link to="/login"><i className="bi bi-arrow-left me-1"></i>Back to Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;