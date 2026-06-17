import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaShieldAlt,
  FaBug,
  FaChartLine,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${open ? "show" : ""}`}>

        <div className="sidebar-logo">
          CYBER<span>INTEL</span>
        </div>

        <nav>

          <Link to="/dashboard">
            <FaHome />
            Dashboard
          </Link>


              <Link to="/admin-dashboard">
  <FaShieldAlt />
  Admin Panel
</Link>    

          <Link to="#">
            <FaShieldAlt />
            Threat Feed
          </Link>

          <Link to="#">
            <FaBug />
            Malware Analysis
          </Link>

          <Link to="#">
            <FaChartLine />
            Analytics
          </Link>

          <Link to="#">
            <FaCog />
            Settings
          </Link>

          <Link to="/login">
            <FaSignOutAlt />
            Logout
          </Link>

        </nav>

      </aside>
    </>
  );
}

export default Sidebar;