import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./Footer.css";
import logo from "../../assets/stackly_logo.webp"
function Footer() {
  const navigate=useNavigate()
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">

        {/* About Section */}
        <div className="footer-about">

          {/* Logo Placeholder */}
          <div className="footer-logo" onClick={()=>navigate("/")}>
            <img
              src={logo}
              alt="CyberIntel Logo"
              
            />
          </div>

          

          <p>
            Advanced cyber intelligence platform for monitoring threats,
            malware activities, and security incidents worldwide.
          </p>

          <div className="social-icons">
  <Link to="/facebook">
    <FaFacebookF />
  </Link>

  <Link to="/twitter">
    <FaTwitter />
  </Link>

  <Link to="/linkedin">
    <FaLinkedinIn />
  </Link>

  <Link to="/instagram">
    <FaInstagram />
  </Link>
</div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/threat">Threat</Link>
            </li>

            <li>
              <Link to="/service">Service</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className="footer-contact">
          <h3>Contact Us</h3>

          <ul>
            <li>
              <FaPhoneAlt />
              <span>+91 98765 43210</span>
            </li>

            <li>
              <FaEnvelope />
              <span>contact@stackly.com</span>
            </li>

            <li>
              <FaMapMarkerAlt />
              <span>Hyderabad, India</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="copyright">
        © 2026 CyberIntel. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;