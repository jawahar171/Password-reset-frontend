// ─────────────────────────────────────────────
//  src/pages/Register.js
//
//  Allows new users to create an account.
//  On success: stores JWT → redirects to /dashboard
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Alert from "../components/Alert";
import PasswordStrength from "../components/PasswordStrength";

function Register() {
  const navigate = useNavigate();

  // ── Form state ────────────────────────────
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [alert, setAlert]         = useState({ type: "", message: "" });

  // ── Handlers ──────────────────────────────
  const handleChange = (e) => {
    setAlert({ type: "", message: "" }); // clear error on typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      return setAlert({ type: "danger", message: "Passwords do not match." });
    }
    if (form.password.length < 6) {
      return setAlert({ type: "danger", message: "Password must be at least 6 characters." });
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const { data } = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      // Store JWT in localStorage — all protected API calls will use this
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setAlert({
        type: "danger",
        message: err.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="auth-card fade-in-up">

              {/* Header */}
              <div className="text-center mb-4">
                <div className="auth-icon-circle">
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h2 className="fw-bold mb-1" style={{ color: "#1a237e" }}>Create Account</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Join SecureAuth — it's free
                </p>
              </div>

              {/* Alert */}
              <Alert type={alert.type} message={alert.message} />

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>

                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    Username
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="e.g. johndoe"
                      value={form.username}
                      onChange={handleChange}
                      required
                      minLength={3}
                      maxLength={30}
                      autoComplete="username"
                    />
                  </div>
                  <div className="form-text">3–30 characters</div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    Password
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
                    />
                    {/* Show / hide toggle */}
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
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Repeat your password"
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
                        color: form.password === form.confirmPassword ? "#42b72a" : "#ef5350",
                        fontWeight: 500,
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
                      Creating account…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check me-2"></i>
                      Create Account
                    </>
                  )}
                </button>
              </form>

              {/* Footer link */}
              <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                Already have an account?{" "}
                <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;