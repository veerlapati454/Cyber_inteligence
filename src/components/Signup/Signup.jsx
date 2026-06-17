import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF
} from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { toast } from "react-toastify";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [emailError, setEmailError] = useState("");
  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      const filteredValue = value.replace(
        /[^A-Za-z\s]/g,
        ""
      );

      setForm({
        ...form,
        [name]: filteredValue,
      });

      return;
    }

    if (name === "username") {
      const filteredValue = value.replace(
        /[^A-Za-z]/g,
        ""
      );

      setForm({
        ...form,
        [name]: filteredValue,
      });

      return;
    }

    if (name === "email") {
      setForm({
        ...form,
        email: value,
      });

      const gmailRegex =
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

      if (value === "") {
        setEmailError("");
      } else if (!gmailRegex.test(value)) {
        setEmailError(
          "Only valid Gmail addresses are allowed"
        );
      } else {
        setEmailError("");
      }

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    const fullNameRegex = /^[A-Za-z\s]+$/;
    const usernameRegex = /^[A-Za-z]+$/;
    const gmailRegex =
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!fullNameRegex.test(form.fullName)) {
      alert(
        "Full Name should contain only alphabets"
      );
      return;
    }

    if (!usernameRegex.test(form.username)) {
      alert(
        "Username should contain only alphabets"
      );
      return;
    }

    if (!gmailRegex.test(form.email)) {
      alert(
        "Only Gmail addresses are allowed"
      );
      return;
    }

    if (form.password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      form.password !== form.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      alert(
        "Please accept Terms & Conditions"
      );
      return;
    }

    toast.success("Registration Successful!");
    navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* Back To Home */}
        <button
          type="button"
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          <HiArrowLeft />
          Back to Home
        </button>

        <h2>Create Account</h2>

        <p>
          Join Cyber Intelligence Platform
        </p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter Full Name"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          {/* Username */}
          <div className="input-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Gmail Address</label>

            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
            />

            {emailError && (
              <small className="error-text">
                {emailError}
              </small>
            )}
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-box">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
              />

              <span
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>
              Confirm Password
            </label>

            <div className="password-box">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              <span
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="terms-box">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() =>
                setAcceptedTerms(
                  !acceptedTerms
                )
              }
            />

            <label htmlFor="terms">
              I agree to the Terms &
              Conditions and Privacy
              Policy
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="signup-btn-submit"
          >
            Create Account
          </button>

          {/* Social Login */}
          <div className="social-login">

            <button
              type="button"
              className="google-btn"
            >
              <FaGoogle />
              Continue with Google
            </button>

            <button
              type="button"
              className="facebook-btn"
            >
              <FaFacebookF />
              Continue with Facebook
            </button>

          </div>

        </form>

        <div className="signup-footer">
          Already have an account?
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;