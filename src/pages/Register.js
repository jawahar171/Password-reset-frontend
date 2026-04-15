import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Alert from "../components/Alert";

function Register() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [alert, setAlert]       = useState({ type: "", message: "" });

  const validate = () => {
    if (!form.username.trim()) return "Username is required.";
    if (form.username.trim().length < 2) return "Username must be at least 2 characters.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleChange = (e) => {
    setAlert({ type: "", message: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setAlert({ type: "danger", message: validationError });

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const { data } = await registerUser(form);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setAlert({ type: "danger", message: "Registration succeeded but no token received." });
      }
    } catch (err) {
      const d = err.response?.data;
      // Show every field the server returns so we can diagnose
      const parts = [
        d?.message,
        d?.errorMessage && `Detail: ${d.errorMessage}`,
        d?.hint        && `Hint: ${d.hint}`,
        d?.errorCode   && `Code: ${d.errorCode}`,
        !d && err.message,
      ].filter(Boolean);
      setAlert({ type: "danger", message: parts.join(" | ") || "Registration failed." });
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
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h2 className="fw-bold mb-1" style={{ color: "#1a237e" }}>Create Account</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Join us — it only takes a minute.
                </p>
              </div>

              <Alert type={alert.type} message={alert.message} />

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>Username</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input type="text" name="username" className="form-control"
                      placeholder="Your name" value={form.username}
                      onChange={handleChange} required autoFocus autoComplete="username" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input type="email" name="email" className="form-control"
                      placeholder="you@example.com" value={form.email}
                      onChange={handleChange} required autoComplete="email" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type={showPass ? "text" : "password"} name="password"
                      className="form-control" placeholder="Min 6 characters"
                      value={form.password} onChange={handleChange}
                      required minLength={6} autoComplete="new-password" />
                    <button type="button" className="btn btn-outline-secondary"
                      style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }}
                      onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                      <i className={`bi bi-eye${showPass ? "-slash" : ""}`}></i>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary-custom" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account…</>
                    : <><i className="bi bi-person-check me-2"></i>Create Account</>}
                </button>
              </form>

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