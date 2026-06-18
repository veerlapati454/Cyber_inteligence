import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaUser
} from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    const gmailRegex =
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (value === "") {
      setEmailError("");
      setEmailSuccess("");
    } else if (!gmailRegex.test(value)) {
      setEmailError(
        "Only Gmail addresses are allowed"
      );
      setEmailSuccess("");
    } else {
      setEmailError("");
      setEmailSuccess("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const gmailRegex =
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!gmailRegex.test(email)) {
      alert("Only Gmail accounts are allowed");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Back Button */}
        <button
          type="button"
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          <HiArrowLeft />
          Back to Home
        </button>

        <h2>Cyber Intelligence Login</h2>

        <p>
          Access your security monitoring dashboard
        </p>

        {/* Role Selection */}
        <div className="role-switch">
          <button
            type="button"
            className={role === "user" ? "active-role" : ""}
            onClick={() => setRole("user")}
          >
            <FaUser />
            User
          </button>

          <button
            type="button"
            className={role === "admin" ? "active-role" : ""}
            onClick={() => setRole("admin")}
          >
            <FaUserShield />
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={handleEmailChange}
            />

            {emailError && (
              <small className="error-text">
                {emailError}
              </small>
            )}

            {emailSuccess && (
              <small className="success-text">
                {emailSuccess}
              </small>
            )}
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <span
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            <Link to="/404">Forgot Password?</Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-btn-submit"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          Don't have an account?
          <Link to="/signup">
            Signup
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;