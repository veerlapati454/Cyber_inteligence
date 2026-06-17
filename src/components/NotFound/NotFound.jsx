import { Link } from "react-router-dom";
import { FaHome, FaShieldAlt } from "react-icons/fa";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-container">

      <div className="glow-circle"></div>

      <div className="notfound-card">

        <FaShieldAlt className="shield-icon" />

        <h1>404</h1>

        <h2>Threat Not Found</h2>

        <p>
          The intelligence resource you requested
          could not be located.
        </p>

        <Link to="/" className="home-btn">
          <FaHome />
          Return Home
        </Link>

      </div>

    </div>
  );
}

export default NotFound;