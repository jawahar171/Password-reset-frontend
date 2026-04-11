import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import Alert from "../components/Alert";

function Login() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [alert, setAlert]       = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setAlert({ type: "", message: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password)
      return setAlert({ type: "danger", message: "Email and password are required." });

    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const { data } = await loginUser(form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setAlert({
        type: "danger",
        message: err.response?.data?.message || "Login failed. Please try again.",
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

              <div className="text-center mb-4">
                <div className="auth-icon-circle">
                  <i className="bi bi-box-arrow-in-right"></i>
                </div>
                <h2 className="fw-bold mb-1">Welcome Back</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>Sign in to your account</p>
              </div>

              <Alert type={alert.type} message={alert.message} />

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email" name="email" className="form-control"
                      placeholder="you@example.com" value={form.email}
                      onChange={handleChange} required autoFocus autoComplete="email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold mb-0" style={{ fontSize: "0.9rem" }}>
                      Password
                    </label>
                    <Link to="/forgot-password" style={{ fontSize: "0.85rem" }}>
                      Forgot password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      type={showPass ? "text" : "password"} name="password"
                      className="form-control" placeholder="Enter your password"
                      value={form.password} onChange={handleChange}
                      required autoComplete="current-password"
                    />
                    <button
                      type="button" className="btn btn-outline-secondary"
                      style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }}
                      onClick={() => setShowPass(!showPass)} tabIndex={-1}
                    >
                      <i className={`bi bi-eye${showPass ? "-slash" : ""}`}></i>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary-custom" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</>
                  ) : (
                    <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                  )}
                </button>
              </form>

              <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;