import { useState, useEffect, useRef } from "react";
import {
  FaHome, FaUsers, FaUserShield, FaUserCog, FaUserPlus,
  FaKey, FaClipboardList, FaDatabase, FaServer,
  FaChartPie, FaChartBar, FaChartLine,
  FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes,
  FaSearch, FaArrowUp, FaArrowDown,
  FaCheckCircle, FaExclamationTriangle, FaTimesCircle,
  FaFilter, FaDownload, FaEdit, FaTrashAlt, FaEye,
} from "react-icons/fa";
import "./AdminDashboard.css";
import logo from "../../assets/stackly_logo.webp";
import { useNavigate } from "react-router-dom";

/* ─── Count-up hook ─────────────────────────────────────────────────── */
function useCountUp(end, duration = 1500) {
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

/* ─── Stat card ─────────────────────────────────────────────────────── */
function StatCard({ value, suffix = "", label, icon, trend, trendLabel, color }) {
  const count = useCountUp(value);
  return (
    <div className={`adm-stat adm-stat--${color}`}>
      <div className="adm-stat__top">
        <div className="adm-stat__icon">{icon}</div>
        <span className={`adm-stat__trend ${trend >= 0 ? "up" : "down"}`}>
          {trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(trend)}%
        </span>
      </div>
      <div className="adm-stat__value">{count.toLocaleString()}{suffix}</div>
      <div className="adm-stat__label">{label}</div>
      <div className="adm-stat__sub">{trendLabel}</div>
    </div>
  );
}

/* ─── Donut chart (SVG) ─────────────────────────────────────────────── */
function Donut({ segments, size = 100 }) {
  const r = 36, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap = circ - dash;
        const el = (
          <circle
            key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#e2f0ff" fontSize="13" fontWeight="700">
        {total.toLocaleString()}
      </text>
    </svg>
  );
}

/* ─── Mini bar chart (SVG) ──────────────────────────────────────────── */
function MiniBar({ data, color = "#00e5ff" }) {
  const max = Math.max(...data);
  const w = 130, h = 44, barW = Math.floor(w / data.length) - 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {data.map((v, i) => {
        const bh = Math.max(3, (v / max) * (h - 4));
        const x = i * (barW + 2);
        return (
          <rect key={i} x={x} y={h - bh} width={barW} height={bh}
            rx="2" fill={color} opacity={i === data.length - 1 ? 1 : 0.4} />
        );
      })}
    </svg>
  );
}

/* ─── Toggle switch ─────────────────────────────────────────────────── */
function Toggle({ active, onChange }) {
  return (
    <button
      className={`adm-toggle ${active ? "on" : "off"}`}
      onClick={() => onChange(!active)}
      aria-label="Toggle"
    >
      <span className="adm-toggle__thumb" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [searchVal, setSearchVal] = useState("");
  const [userToggles, setUserToggles] = useState({ 1: true, 2: true, 3: false, 4: true, 5: true });
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const contentRef = useRef(null);

  const navGroups = [
    {
      label: "Main",
      items: [
        { id: "overview",  icon: <FaHome />,         label: "Overview"       },
        { id: "analytics", icon: <FaChartLine />,    label: "Analytics"      },
        { id: "reports",   icon: <FaChartBar />,     label: "Reports"        },
      ],
    },
    {
      label: "User Management",
      items: [
        { id: "users",  icon: <FaUsers />,      label: "All Users",    badge: "2.4k" },
        { id: "roles",  icon: <FaUserShield />, label: "Roles & Perms" },
        { id: "admins", icon: <FaUserCog />,    label: "Admins"        },
        { id: "invite", icon: <FaUserPlus />,   label: "Invite Users"  },
      ],
    },
    {
      label: "System",
      items: [
        { id: "access",   icon: <FaKey />,           label: "Access Tokens" },
        { id: "audit",    icon: <FaClipboardList />,  label: "Audit Logs",   badge: "18" },
        { id: "database", icon: <FaDatabase />,       label: "Database"      },
        { id: "servers",  icon: <FaServer />,         label: "Servers"       },
      ],
    },
  ];

  const stats = [
    { value: 24381, label: "Total Users",      icon: <FaUsers />,               trend: 12, trendLabel: "vs last month", color: "blue"   },
    { value: 1842,  label: "Active Sessions",  icon: <FaServer />,              trend: 8,  trendLabel: "vs yesterday",  color: "cyan"   },
    { value: 98, suffix: "%", label: "System Uptime", icon: <FaCheckCircle />, trend: 0,  trendLabel: "30-day avg",    color: "green"  },
    { value: 47,    label: "Pending Reviews",  icon: <FaExclamationTriangle />, trend: -5, trendLabel: "vs last week",  color: "orange" },
  ];

  const users = [
    { id: "USR-001", name: "Arjun Sharma",  email: "arjun@acme.io",  role: "Admin",  joined: "Jan 12, 2025", status: "active"    },
    { id: "USR-002", name: "Priya Reddy",   email: "priya@acme.io",  role: "Editor", joined: "Feb 04, 2025", status: "active"    },
    { id: "USR-003", name: "Rohan Mehta",   email: "rohan@acme.io",  role: "Viewer", joined: "Mar 19, 2025", status: "suspended" },
    { id: "USR-004", name: "Sneha Iyer",    email: "sneha@acme.io",  role: "Editor", joined: "Apr 02, 2025", status: "active"    },
    { id: "USR-005", name: "Vikram Das",    email: "vikram@acme.io", role: "Admin",  joined: "May 30, 2025", status: "active"    },
  ];

  const roleData = [
    { label: "Admin",  value: 38,   color: "#00e5ff" },
    { label: "Editor", value: 620,  color: "#0a84ff" },
    { label: "Viewer", value: 1840, color: "#00c97a" },
    { label: "Guest",  value: 512,  color: "#ff8c00" },
  ];

  const loginData  = [210, 340, 290, 480, 390, 560, 440, 680, 520, 740, 600, 820];
  const signupData = [40,  80,  60,  110, 90,  140, 100, 160, 120, 180, 140, 200];

  const auditLogs = [
    { action: "User deleted",        actor: "admin@acme.io", target: "USR-019", severity: "high",   time: "3m ago"  },
    { action: "Role changed: Admin", actor: "admin@acme.io", target: "USR-002", severity: "high",   time: "12m ago" },
    { action: "Login success",       actor: "priya@acme.io", target: "—",       severity: "info",   time: "18m ago" },
    { action: "Password reset",      actor: "rohan@acme.io", target: "—",       severity: "medium", time: "34m ago" },
    { action: "Export: users.csv",   actor: "sneha@acme.io", target: "—",       severity: "medium", time: "1h ago"  },
    { action: "Failed login ×5",     actor: "unknown",        target: "—",       severity: "high",   time: "2h ago"  },
  ];

  const servers = [
    { name: "API Gateway",  cpu: 34, mem: 52, status: "healthy" },
    { name: "Auth Service", cpu: 61, mem: 74, status: "warning" },
    { name: "DB Primary",   cpu: 22, mem: 41, status: "healthy" },
    { name: "CDN Edge",     cpu: 8,  mem: 18, status: "healthy" },
  ];

  /* ─── Nav click handler ─────────────────────────────────────────── */
  const handleNavClick = (id) => {
    setActiveNav(id);
    setSidebarOpen(false);

    if (id === "overview") {
      // Target every possible scroll container
      const targets = [
        mainRef.current,
        contentRef.current,
        document.documentElement,
        document.body,
        document.querySelector(".adm-main"),
        document.querySelector(".adm-content"),
        document.querySelector(".adm-layout"),
      ];
      targets.forEach((el) => {
        if (el) {
          try {
            el.scrollTo({ top: 0, behavior: "smooth" });
          } catch {
            el.scrollTop = 0;
          }
        }
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/404");
    }
  };

  return (
    <div className={`adm-layout ${sidebarOpen ? "sidebar-expanded" : ""}`}>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="adm-sidebar__logo">
          <div className="adm-logo-placeholder">
            <img src={logo} alt="Stackly logo" />
          </div>
          <button className="adm-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="adm-sidebar__nav">
          {navGroups.map((group) => (
            <div className="adm-nav-group" key={group.label}>
              <span className="adm-nav-group__label">{group.label}</span>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`adm-nav-item ${activeNav === item.id ? "active" : ""}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="adm-nav-item__icon">{item.icon}</span>
                  <span className="adm-nav-item__label">{item.label}</span>
                  {item.badge && <span className="adm-nav-item__badge">{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="adm-sidebar__footer">
          <div className="adm-admin-chip">
            <div className="adm-admin-chip__avatar">SA</div>
            <div className="adm-admin-chip__info">
              <span className="adm-admin-chip__name">Super Admin</span>
              <span className="adm-admin-chip__role">admin@stackly.io</span>
            </div>
          </div>
          <div className="adm-sidebar__footer-actions">
            <button className="adm-nav-item" onClick={() => navigate("/404")}>
              <span className="adm-nav-item__icon"><FaCog /></span>
              <span className="adm-nav-item__label">Settings</span>
            </button>
            <button className="adm-nav-item adm-nav-item--logout" onClick={() => navigate("/login")}>
              <span className="adm-nav-item__icon"><FaSignOutAlt /></span>
              <span className="adm-nav-item__label">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ────────────────────────────────────────────────────── */}
      <main className="adm-main" ref={mainRef}>

        {/* Topbar */}
        <header className="adm-topbar">
          <button className="adm-topbar__menu" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>

          <div className="adm-topbar__search">
            <FaSearch className="adm-topbar__search-icon" />
            <input
              type="text"
              placeholder="Search users, roles, logs…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </div>

          <div className="adm-topbar__right">
            <div className="adm-topbar__env">
              <span className="adm-env-dot" />
              <span className="adm-env-label">Production</span>
            </div>
            <button className="adm-topbar__notif" onClick={() => navigate("/404")}>
              <FaBell />
              <span className="adm-notif-badge">5</span>
            </button>
            <div className="adm-topbar__avatar" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>SA</div>
          </div>
        </header>

        {/* Content */}
        <div className="adm-content" ref={contentRef}>

          {/* Page header */}
          <div className="adm-page-header">
            <div className="adm-page-header__text">
              <h1>Admin Dashboard</h1>
              <p>Manage users, roles, system health, and audit logs from one place.</p>
            </div>
            <div className="adm-page-header__actions">
              <button className="adm-btn adm-btn--ghost" onClick={() => navigate("/404")}>
                <FaDownload /> Export
              </button>
              <button className="adm-btn adm-btn--primary" onClick={() => navigate("/404")}>
                <FaUserPlus /> Add User
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="adm-stats-grid">
            {stats.map((s, i) => <StatCard key={i} {...s} />)}
          </div>

          {/* Mid row — activity + donut + servers */}
          <div className="adm-mid-row">

            <div className="adm-card adm-activity-card">
              <div className="adm-card__header">
                <h2>User Activity</h2>
                <span className="adm-card__meta">Last 12 months</span>
              </div>
              <div className="adm-activity-body">
                <div className="adm-activity-row">
                  <div className="adm-activity-meta">
                    <span className="adm-activity-label">Logins</span>
                    <span className="adm-activity-val">820 <span>this month</span></span>
                  </div>
                  <MiniBar data={loginData} color="#00e5ff" />
                </div>
                <div className="adm-activity-row">
                  <div className="adm-activity-meta">
                    <span className="adm-activity-label">Sign-ups</span>
                    <span className="adm-activity-val">200 <span>this month</span></span>
                  </div>
                  <MiniBar data={signupData} color="#0a84ff" />
                </div>
                <div className="adm-activity-row">
                  <div className="adm-activity-meta">
                    <span className="adm-activity-label">Sessions</span>
                    <span className="adm-activity-val">1,842 <span>active now</span></span>
                  </div>
                  <MiniBar data={[300,520,410,640,500,720,580,800,640,860,720,900]} color="#00c97a" />
                </div>
              </div>
            </div>

            <div className="adm-card adm-donut-card">
              <div className="adm-card__header">
                <h2>Role Distribution</h2>
                <span className="adm-card__meta">All users</span>
              </div>
              <div className="adm-donut-body">
                <Donut segments={roleData} size={110} />
                <div className="adm-donut-legend">
                  {roleData.map((r, i) => (
                    <div className="adm-legend-row" key={i}>
                      <span className="adm-legend-dot" style={{ background: r.color }} />
                      <span className="adm-legend-label">{r.label}</span>
                      <span className="adm-legend-val">{r.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="adm-card adm-servers-card">
              <div className="adm-card__header">
                <h2>Server Health</h2>
                <span className="adm-card__meta">Live</span>
              </div>
              <div className="adm-servers-body">
                {servers.map((srv, i) => (
                  <div className="adm-server-row" key={i}>
                    <div className="adm-server-name">
                      <span className={`adm-server-dot adm-server-dot--${srv.status}`} />
                      {srv.name}
                    </div>
                    <div className="adm-server-bars">
                      <div className="adm-mini-bar-wrap">
                        <span>CPU</span>
                        <div className="adm-mini-track">
                          <div
                            className="adm-mini-fill"
                            style={{
                              width: `${srv.cpu}%`,
                              background: srv.cpu > 70 ? "#ff5a5a" : srv.cpu > 50 ? "#ff8c00" : "#00c97a"
                            }}
                          />
                        </div>
                        <span>{srv.cpu}%</span>
                      </div>
                      <div className="adm-mini-bar-wrap">
                        <span>MEM</span>
                        <div className="adm-mini-track">
                          <div
                            className="adm-mini-fill"
                            style={{
                              width: `${srv.mem}%`,
                              background: srv.mem > 70 ? "#ff5a5a" : srv.mem > 50 ? "#ff8c00" : "#0a84ff"
                            }}
                          />
                        </div>
                        <span>{srv.mem}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* User management table */}
          <div className="adm-card">
            <div className="adm-card__header">
              <h2>User Management</h2>
              <div className="adm-card__header-actions">
                <button className="adm-icon-btn" onClick={() => navigate("/404")}><FaFilter /></button>
                <button className="adm-icon-btn" onClick={() => navigate("/404")}><FaDownload /></button>
                <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => navigate("/404")}>
                  <FaUserPlus /> Add
                </button>
              </div>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th className="hide-sm">Joined</th>
                    <th>Status</th>
                    <th className="hide-xs">Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u.id}>
                      <td>
                        <div className="adm-user-cell">
                          <div className="adm-user-avatar">
                            {u.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div className="adm-user-info">
                            <div className="adm-user-name">{u.name}</div>
                            <div className="adm-user-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`adm-role-badge adm-role-badge--${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="hide-sm adm-muted">{u.joined}</td>
                      <td>
                        <span className={`adm-status adm-status--${u.status}`}>
                          {u.status === "active" ? <FaCheckCircle /> : <FaTimesCircle />}
                          <span className="adm-status-label">{u.status}</span>
                        </span>
                      </td>
                      <td className="hide-xs">
                        <Toggle
                          active={userToggles[idx + 1]}
                          onChange={(v) => setUserToggles(p => ({ ...p, [idx + 1]: v }))}
                        />
                      </td>
                      <td>
                        <div className="adm-action-btns">
                          <button className="adm-action-btn adm-action-btn--view"   title="View"   onClick={() => navigate("/404")}><FaEye /></button>
                          <button className="adm-action-btn adm-action-btn--edit"   title="Edit"   onClick={() => navigate("/404")}><FaEdit /></button>
                          <button className="adm-action-btn adm-action-btn--delete" title="Delete" onClick={() => navigate("/404")}><FaTrashAlt /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="adm-table-footer">
              <span className="adm-muted">Showing 5 of 2,438 users</span>
              <div className="adm-pagination">
                <button className="adm-page-btn" disabled>‹</button>
                <button className="adm-page-btn active" onClick={() => navigate("/404")}>1</button>
                <button className="adm-page-btn" onClick={() => navigate("/404")}>2</button>
                <button className="adm-page-btn" onClick={() => navigate("/404")}>3</button>
                <span className="adm-muted">…</span>
                <button className="adm-page-btn" onClick={() => navigate("/404")}>488</button>
                <button className="adm-page-btn" onClick={() => navigate("/404")}>›</button>
              </div>
            </div>
          </div>

          {/* Bottom row — audit log + quick actions */}
          <div className="adm-bottom-row">

            <div className="adm-card adm-audit-card">
              <div className="adm-card__header">
                <h2>Audit Log</h2>
                <button className="adm-card__btn" onClick={() => navigate("/404")}>View all</button>
              </div>
              <div className="adm-audit-list">
                {auditLogs.map((log, i) => (
                  <div className="adm-audit-row" key={i}>
                    <span className={`adm-audit-sev adm-audit-sev--${log.severity}`}>
                      {log.severity === "info" ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    </span>
                    <div className="adm-audit-body">
                      <p>{log.action}</p>
                      <span>{log.actor}{log.target !== "—" ? ` → ${log.target}` : ""}</span>
                    </div>
                    <span className="adm-audit-time">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="adm-card adm-quick-card">
              <div className="adm-card__header">
                <h2>Quick Actions</h2>
              </div>
              <div className="adm-quick-grid">
                {[
                  { icon: <FaUserPlus />,      label: "Add User",      color: "blue"   },
                  { icon: <FaUserShield />,    label: "Manage Roles",  color: "cyan"   },
                  { icon: <FaKey />,           label: "Revoke Token",  color: "orange" },
                  { icon: <FaDatabase />,      label: "Backup DB",     color: "green"  },
                  { icon: <FaClipboardList />, label: "Export Logs",   color: "purple" },
                  { icon: <FaChartPie />,      label: "Run Report",    color: "teal"   },
                  { icon: <FaServer />,        label: "Restart Node",  color: "red"    },
                  { icon: <FaCog />,           label: "System Config", color: "gray"   },
                ].map((qa, i) => (
                  <button
                    className={`adm-quick-btn adm-quick-btn--${qa.color}`}
                    key={i}
                    onClick={() => navigate("/404")}
                  >
                    <span className="adm-quick-btn__icon">{qa.icon}</span>
                    <span className="adm-quick-btn__label">{qa.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}