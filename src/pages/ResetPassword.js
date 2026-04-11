import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../services/api";
import Alert from "../components/Alert";

function ResetPassword() {
  const { token }  = useParams();
  const navigate   = useNavigate();

  const [form, setForm]             = useState({ password: "", confirmPassword: "" });
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [verifying, setVerifying]   = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail]   = useState("");
  const [alert, setAlert]           = useState({ type: "", message: "" });
  const [success, setSuccess]       = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await verifyResetToken(token);
        if (data.valid) {
          setTokenValid(true);
          setUserEmail(data.email);
        } else {
          setTokenValid(false);
        }
      } catch {
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [token]);

  const handleChange = (e) => {
    setAlert({ type: "", message: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (!form.confirmPassword) return "Please confirm your password.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return setAlert({ type: "danger", message: error });

    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const { data } = await resetPassword(token, form.password, form.confirmPassword);
      localStorage.setItem("token", data.token);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      setAlert({
        type: "danger",
        message: err.response?.data?.message || "Reset failed. Please request a new link.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (verifying) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <div className="auth-card fade-in-up text-center">
                <span className="spinner-border text-primary mb-3"></span>
                <p className="text-muted">Verifying your reset link…</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid / expired token
  if (!tokenValid) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <div className="auth-card fade-in-up text-center">
                <div className="auth-icon-circle" style={{ background: "#fee2e2" }}>
                  <i className="bi bi-x-circle" style={{ color: "#991b1b" }}></i>
                </div>
                <h2 className="fw-bold mb-2">Link Expired</h2>
                <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link to="/forgot-password" className="btn-primary-custom" style={{ display: "block", textDecoration: "none", textAlign: "center" }}>
                  <i className="bi bi-arrow-repeat me-2"></i>Request New Link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <div className="auth-card fade-in-up text-center">
                <div className="auth-icon-circle" style={{ background: "#d1fae5" }}>
                  <i className="bi bi-check-circle" style={{ color: "#065f46" }}></i>
                </div>
                <h2 className="fw-bold mb-2">Password Reset!</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Your password has been changed. Redirecting you to your dashboard…
                </p>
                <div className="spinner-border spinner-border-sm text-primary mt-3"></div>
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
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h2 className="fw-bold mb-1">Set New Password</h2>
                {userEmail && (
                  <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Resetting password for <strong>{userEmail}</strong>
                  </p>
                )}
              </div>

              <Alert type={alert.type} message={alert.message} />

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    New Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      type={showPass ? "text" : "password"} name="password"
                      className="form-control" placeholder="Min 6 characters"
                      value={form.password} onChange={handleChange}
                      required minLength={6} autoComplete="new-password"
                    />
                    <button type="button" className="btn btn-outline-secondary"
                      style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }}
                      onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                      <i className={`bi bi-eye${showPass ? "-slash" : ""}`}></i>
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    Confirm New Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                    <input
                      type={showConfirm ? "text" : "password"} name="confirmPassword"
                      className="form-control" placeholder="Repeat new password"
                      value={form.confirmPassword} onChange={handleChange}
                      required autoComplete="new-password"
                    />
                    <button type="button" className="btn btn-outline-secondary"
                      style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }}
                      onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                      <i className={`bi bi-eye${showConfirm ? "-slash" : ""}`}></i>
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <div style={{ fontSize: "0.8rem", color: "#dc3545", marginTop: "4px" }}>
                      <i className="bi bi-x-circle me-1"></i>Passwords do not match.
                    </div>
                  )}
                  {form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 6 && (
                    <div style={{ fontSize: "0.8rem", color: "#198754", marginTop: "4px" }}>
                      <i className="bi bi-check-circle me-1"></i>Passwords match.
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary-custom"
                  disabled={loading || (form.confirmPassword && form.password !== form.confirmPassword)}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Resetting…</>
                  ) : (
                    <><i className="bi bi-shield-check me-2"></i>Reset Password</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;