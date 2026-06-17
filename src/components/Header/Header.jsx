import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import logo from "../../assets/stackly_logo.webp"; // Replace with your logo image

import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="CyberIntel Logo" />
        </Link>

        {/* Right Side */}
        <div className="right-section">

          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link to="/">Home</Link>
            <Link to="/service">Services</Link>
            <Link to="/threat">Threat</Link>
            <Link to="/contact">Contact</Link>

            <Link to="/login" className="mobile-btn">
              Login
            </Link>

            <Link to="/signup" className="mobile-btn signup-btn">
              Signup
            </Link>
          </nav>

          <div className="header-buttons">
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/signup" className="signup-btn">
              Signup
            </Link>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>

        </div>
      </div>
    </header>
  );
}

export default Header;