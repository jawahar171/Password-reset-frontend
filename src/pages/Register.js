import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Alert from "../components/Alert";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Handle input change
  const handleChange = (e) => {
    setAlert({ type: "", message: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation
  const validate = () => {
    if (!form.username.trim()) return "Username is required.";
    if (form.username.trim().length < 2)
      return "Username must be at least 2 characters.";

    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
      return "Please enter a valid email.";

    if (!form.password) return "Password is required.";
    if (!/(?=.*[A-Za-z])(?=.*\d).{6,}/.test(form.password))
      return "Password must contain letters and numbers (min 6 characters).";

    return null;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const error = validate();
    if (error) {
      return setAlert({ type: "danger", message: error });
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const { data } = await registerUser(form);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setAlert({
          type: "danger",
          message: "Registration succeeded but no token received.",
        });
      }
    } catch (err) {
      setAlert({
        type: "danger",
        message:
          err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again.",
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
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h2 className="fw-bold mb-1">Create Account</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Join us — it only takes a minute.
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
                      placeholder="Your name"
                      value={form.username}
                      onChange={handleChange}
                      required
                      autoComplete="username"
                    />
                  </div>
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
                <div className="mb-4">
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
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }}
                      onClick={() => setShowPass(!showPass)}
                    >
                      <i className={`bi bi-eye${showPass ? "-slash" : ""}`}></i>
                    </button>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#6c757d", marginTop: "4px" }}>
                    Must be at least 6 characters and include letters & numbers.
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn-primary-custom" disabled={loading}>
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

              {/* Footer */}
              <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;