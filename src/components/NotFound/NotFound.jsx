import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

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

        <div className="btn-row">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Go Back
          </button>

          <Link to="/" className="home-btn">
            <FaHome />
            Return Home
          </Link>
        </div>

      </div>

    </div>
  );
}

export default NotFound;