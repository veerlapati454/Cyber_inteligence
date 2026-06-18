import { useState, useEffect, useRef } from "react";
import {
  FaShieldAlt, FaBug, FaLock, FaServer,
  FaGlobe, FaUserSecret, FaHome, FaChartBar,
  FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes,
  FaExclamationTriangle, FaCheckCircle, FaSearch,
  FaArrowUp, FaArrowDown, FaEye, FaNetworkWired,
} from "react-icons/fa";
import "./Dashboard.css";
import logo from "../../assets/stackly_logo.webp";
import { useNavigate } from "react-router-dom";

/* ─── Mini count-up ─────────────────────────────────────────────────────── */
function useCountUp(end, duration = 1600) {
  const [val, setVal] = useState(0);
  const startRef = useRef(null);
  useEffect(() => {
    let raf;
    function step(ts) {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(e * end));
      if (p < 1) raf = requestAnimationFrame(step);
      else setVal(end);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return val;
}

/* ─── Animated stat card ────────────────────────────────────────────────── */
function StatCard({ value, suffix = "", label, icon, trend, trendLabel, color }) {
  const count = useCountUp(value);
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__top">
        <div className="stat-card__icon">{icon}</div>
        <span className={`stat-card__trend ${trend > 0 ? "up" : "down"}`}>
          {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(trend)}%
        </span>
      </div>
      <div className="stat-card__value">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__sublabel">{trendLabel}</div>
    </div>
  );
}

/* ─── Mini sparkline (SVG) ──────────────────────────────────────────────── */
function Sparkline({ data, color = "#00e5ff" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 120, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h * 0.85 - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Radial gauge ──────────────────────────────────────────────────────── */
function Gauge({ pct, label, color }) {
  const r = 38, cx = 48, cy = 48;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="gauge">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 1.2s ease" }}
        />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#e2f0ff" fontSize="13" fontWeight="700">
          {pct}%
        </text>
      </svg>
      <span className="gauge__label">{label}</span>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────────────────── */
function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchVal, setSearchVal] = useState("");

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const navItems = [
    { id: "dashboard", icon: <FaHome />,               label: "Dashboard"      },
    { id: "threats",   icon: <FaShieldAlt />,           label: "Threats"        },
    { id: "malware",   icon: <FaBug />,                 label: "Malware"        },
    { id: "network",   icon: <FaNetworkWired />,        label: "Network"        },
    { id: "incidents", icon: <FaExclamationTriangle />, label: "Incidents"      },
    { id: "reports",   icon: <FaChartBar />,            label: "Reports"        },
    { id: "audit",     icon: <FaLock />,                label: "Audit Logs"     },
    { id: "intel",     icon: <FaGlobe />,               label: "Dark Web Intel" },
    { id: "soc",       icon: <FaServer />,              label: "SOC Monitor"    },
    { id: "response",  icon: <FaUserSecret />,          label: "IR Console"     },
  ];

  const threats = [
    { id: "#T-1042", name: "Ransomware – LockBit 3.0", severity: "critical", status: "Investigating", src: "185.234.xx.xx", time: "2 min ago" },
    { id: "#T-1041", name: "Phishing – BEC Campaign",  severity: "high",     status: "Blocked",       src: "91.108.xx.xx",  time: "17 min ago" },
    { id: "#T-1040", name: "Botnet – Mirai Variant",   severity: "high",     status: "Monitoring",    src: "45.33.xx.xx",   time: "34 min ago" },
    { id: "#T-1039", name: "SQLi Probe",                severity: "medium",   status: "Blocked",       src: "203.0.xx.xx",   time: "1 hr ago" },
    { id: "#T-1038", name: "Port Scan – Masscan",       severity: "low",      status: "Logged",        src: "104.21.xx.xx",  time: "2 hr ago" },
    { id: "#T-1037", name: "Credential Stuffing",       severity: "medium",   status: "Investigating", src: "198.51.xx.xx",  time: "3 hr ago" },
  ];

  const intel = [
    { region: "Eastern Europe", count: 3812, bar: 82, color: "#ff3b3b" },
    { region: "Southeast Asia", count: 2540, bar: 55, color: "#ff8c00" },
    { region: "North America",  count: 1920, bar: 42, color: "#f5c400" },
    { region: "Middle East",    count: 1340, bar: 29, color: "#0a84ff" },
    { region: "West Africa",    count:  870, bar: 19, color: "#00c97a" },
  ];

  const activityData = [12, 28, 18, 44, 36, 55, 40, 62, 48, 70, 54, 83];
  const malwareData  = [5,  9,  7,  22, 15, 31, 20, 38, 25, 44, 30, 51];

  const alerts = [
    { icon: <FaExclamationTriangle />, color: "critical", text: "New ransomware strain detected on node 192.168.1.44",  time: "2m"  },
    { icon: <FaCheckCircle />,         color: "success",  text: "Phishing domain takedown confirmed",                   time: "18m" },
    { icon: <FaBell />,                color: "high",     text: "Unusual outbound traffic – 4 GB exfiltration attempt", time: "34m" },
    { icon: <FaEye />,                 color: "medium",   text: "Dark web mention: company credentials listed for sale",time: "1h"  },
    { icon: <FaShieldAlt />,           color: "success",  text: "SOC patched CVE-2025-2891 across 48 endpoints",        time: "2h"  },
  ];

  /* ─── Nav click handler ─────────────────────────────────────────── */
  const handleNavClick = (id) => {
    setActiveNav(id);
    setSidebarOpen(false);
    if (id === "dashboard") {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/404");
    }
  };

  return (
    <div className={`dashboard-layout ${sidebarOpen ? "sidebar-expanded" : ""}`}>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar__logo">
          <div className="logo-placeholder">
            <img src={logo} alt="" />
          </div>
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`sidebar__nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="sidebar__nav-label">{item.label}</span>
              {item.id === "threats" && (
                <span className="sidebar__badge">6</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__nav-item" onClick={() => navigate("/404")}>
            <span className="sidebar__nav-icon"><FaCog /></span>
            <span className="sidebar__nav-label">Settings</span>
          </button>
          <button
            className="sidebar__nav-item sidebar__nav-item--logout"
            onClick={() => navigate("/login")}
          >
            <span className="sidebar__nav-icon"><FaSignOutAlt /></span>
            <span className="sidebar__nav-label">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ────────────────────────────────────────────────────── */}
      <div className="dashboard-main">

        {/* Sticky topbar */}
        <header className="topbar">
          <button className="topbar__menu" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <div className="topbar__search">
            <FaSearch className="topbar__search-icon" />
            <input
              type="text"
              placeholder="Search threats, IPs, IOCs…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </div>
          <div className="topbar__right">
            <div className="topbar__live">
              <span className="live-dot" />
              <span className="live-label">Live</span>
            </div>
            <button className="topbar__notif" onClick={() => navigate("/404")}>
              <FaBell />
              <span className="notif-badge">3</span>
            </button>
            <div className="topbar__avatar" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>SA</div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="dashboard-scroll" ref={scrollRef}>
          <div className="dashboard-content">

            <div className="page-header">
              <div>
                <h1>Cyber Intelligence Dashboard</h1>
                <p>Monitor threats, incidents and security intelligence in real-time.</p>
              </div>
              <div className="page-header__date">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <StatCard value={12548} label="Threats Detected"  icon={<FaShieldAlt />}           trend={14}  trendLabel="vs last week"  color="blue"   />
              <StatCard value={3456}  label="Malware Samples"   icon={<FaBug />}                 trend={-6}  trendLabel="vs last week"  color="red"    />
              <StatCard value={98}    suffix="%" label="Detection Rate" icon={<FaCheckCircle />} trend={2}   trendLabel="vs last month" color="green"  />
              <StatCard value={247}   label="Active Incidents"  icon={<FaExclamationTriangle />} trend={22}  trendLabel="vs yesterday"  color="orange" />
            </div>

            {/* Activity + Gauges */}
            <div className="mid-row">
              <div className="activity-card card">
                <div className="card__header">
                  <h2>Threat Activity</h2>
                  <span className="card__meta">Last 12 hours</span>
                </div>
                <div className="activity-charts">
                  <div className="activity-chart-item">
                    <span className="chart-label">All Threats</span>
                    <Sparkline data={activityData} color="#00e5ff" />
                    <span className="chart-val">+83 <span>now</span></span>
                  </div>
                  <div className="activity-chart-item">
                    <span className="chart-label">Malware</span>
                    <Sparkline data={malwareData} color="#ff5a5a" />
                    <span className="chart-val">+51 <span>now</span></span>
                  </div>
                </div>
              </div>

              <div className="gauges-card card">
                <div className="card__header">
                  <h2>System Health</h2>
                  <span className="card__meta">Live</span>
                </div>
                <div className="gauges-grid">
                  <Gauge pct={98} label="Detection" color="#00e5ff" />
                  <Gauge pct={76} label="Endpoints"  color="#0a84ff" />
                  <Gauge pct={91} label="Uptime"     color="#00c97a" />
                  <Gauge pct={43} label="Capacity"   color="#f5c400" />
                </div>
              </div>
            </div>

            {/* Threat table */}
            <div className="card threat-card">
              <div className="card__header">
                <h2>Recent Threat Feed</h2>
                <button className="card__btn" onClick={() => navigate("/404")}>View All</button>
              </div>
              <div className="table-wrap">
                <table className="threat-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Threat</th>
                      <th>Source IP</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threats.map(t => (
                      <tr key={t.id}>
                        <td className="threat-id">{t.id}</td>
                        <td>{t.name}</td>
                        <td className="source-ip">{t.src}</td>
                        <td><span className={`badge badge--${t.severity}`}>{t.severity}</span></td>
                        <td><span className={`status status--${t.status.toLowerCase().replace(" ", "")}`}>{t.status}</span></td>
                        <td className="time-cell">{t.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom row */}
            <div className="bottom-row">
              <div className="card geo-card">
                <div className="card__header">
                  <h2>Attack Origins</h2>
                  <span className="card__meta">Top regions</span>
                </div>
                <div className="geo-list">
                  {intel.map((r, i) => (
                    <div className="geo-row" key={i}>
                      <span className="geo-region">{r.region}</span>
                      <div className="geo-bar-wrap">
                        <div className="geo-bar" style={{ width: `${r.bar}%`, background: r.color }} />
                      </div>
                      <span className="geo-count">{r.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card alerts-card">
                <div className="card__header">
                  <h2>Recent Alerts</h2>
                  <button className="card__btn" onClick={() => navigate("/404")}>Mark all read</button>
                </div>
                <div className="alerts-list">
                  {alerts.map((a, i) => (
                    <div className="alert-row" key={i}>
                      <span className={`alert-icon alert-icon--${a.color}`}>{a.icon}</span>
                      <div className="alert-body">
                        <p>{a.text}</p>
                        <span>{a.time} ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;