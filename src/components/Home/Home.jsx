import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaBug,
  FaLock,
  FaServer,
  FaGlobe,
  FaUserSecret,
  FaCheckCircle,
  FaLinkedin,
  FaTwitter,
  FaSearch,
  FaNetworkWired
} from "react-icons/fa";

import "./Home.css";
import z1 from "../../assets/z1.webp";
import z2 from "../../assets/z2.webp";
import z3 from "../../assets/z3.webp";
import z4 from "../../assets/z4.webp";
import z5 from "../../assets/z5.webp";
import z6 from "../../assets/z6.webp";

/* ─── Scroll-reveal hook ─────────────────────────────────────────────────── */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ─── Count-up hook ──────────────────────────────────────────────────────── */
function useCountUp(end, visible, duration = 1400) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    function step(timestamp) {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    }
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [visible, end, duration]);

  return value;
}

/* ─── 3D Canvas hero background hook ────────────────────────────────────── */
function useHeroBg(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const GRID_COLS = 20;
    const GRID_ROWS = 14;
    let time = 0;
    let raf;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 3 + 0.5,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0003,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const scanLines = Array.from({ length: 3 }, (_, i) => ({
      y: i * 0.35 + Math.random() * 0.2,
      speed: 0.0008 + Math.random() * 0.0005,
      alpha: 0.12 + Math.random() * 0.08,
      width: 60 + Math.random() * 80,
    }));

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function project(gx, gy, t) {
      const cx = 0.5, cy = 0.75, fov = 0.55, tilt = 0.52;
      const wave =
        Math.sin(t * 0.6 + gx * 0.3) * 0.06 +
        Math.cos(t * 0.4 + gy * 0.2) * 0.04;
      const nx = (gx / GRID_COLS - 0.5) * 2.2;
      const ny = (gy / GRID_ROWS - 0.5) * 2;
      const z = 1 + wave;
      const px = cx + (nx / (z + fov)) * 0.45;
      const py =
        cy +
        ((ny * Math.cos(tilt) - z * Math.sin(tilt)) / (z + fov)) * 0.55;
      return { x: px * canvas.width, y: py * canvas.height };
    }

    function draw() {
      time += 0.012;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.7);
      bg.addColorStop(0, "#071525");
      bg.addColorStop(0.5, "#030e1a");
      bg.addColorStop(1, "#010810");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cg = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, W * 0.38);
      cg.addColorStop(0, "rgba(0,120,200,0.07)");
      cg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);

      for (let row = 0; row <= GRID_ROWS; row++) {
        const pts = Array.from({ length: GRID_COLS + 1 }, (_, col) =>
          project(col, row, time)
        );
        const d = row / GRID_ROWS;
        ctx.strokeStyle = `rgba(${Math.floor(d * 20)},${Math.floor(80 + d * 120)},${Math.floor(120 + d * 100)},${0.06 + d * 0.22})`;
        ctx.lineWidth = 0.3 + d * 0.5;
        ctx.beginPath();
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
      }

      for (let col = 0; col <= GRID_COLS; col++) {
        const pts = Array.from({ length: GRID_ROWS + 1 }, (_, row) =>
          project(col, row, time)
        );
        const d = col / GRID_COLS;
        ctx.strokeStyle = `rgba(0,120,180,${0.04 + d * 0.15})`;
        ctx.lineWidth = 0.3 + d * 0.4;
        ctx.beginPath();
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
      }

      for (let row = 0; row < GRID_ROWS; row += 2) {
        for (let col = 0; col < GRID_COLS; col += 2) {
          const p = project(col, row, time);
          const depth = row / GRID_ROWS;
          const pulse = Math.sin(time * 2 + col * 0.5 + row * 0.8);
          if (pulse > 0.6 && depth > 0.3) {
            ctx.fillStyle = `rgba(0,200,255,${(pulse - 0.6) * 0.5 * depth})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2 + depth * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.025;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;
        const a = (Math.sin(p.pulse) * 0.3 + 0.7) * p.alpha;
        const px = p.x * W;
        const py = p.y * H;
        const bright = p.z > 2;
        ctx.fillStyle = bright
          ? `rgba(100,220,255,${a * 0.8})`
          : `rgba(40,140,200,${a * 0.5})`;
        ctx.beginPath();
        ctx.arc(px, py, p.r * (bright ? 1.3 : 1), 0, Math.PI * 2);
        ctx.fill();
        if (bright && a > 0.5) {
          const g2 = ctx.createRadialGradient(px, py, 0, px, py, p.r * 5);
          g2.addColorStop(0, `rgba(0,200,255,${a * 0.15})`);
          g2.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(px, py, p.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const sl of scanLines) {
        sl.y += sl.speed;
        if (sl.y > 1.1) sl.y = -0.05;
        const sy = sl.y * H;
        const sg = ctx.createLinearGradient(0, sy - sl.width, 0, sy + sl.width);
        sg.addColorStop(0, "rgba(0,0,0,0)");
        sg.addColorStop(0.4, `rgba(0,180,255,${sl.alpha * 0.3})`);
        sg.addColorStop(0.5, `rgba(0,220,255,${sl.alpha})`);
        sg.addColorStop(0.6, `rgba(0,180,255,${sl.alpha * 0.3})`);
        sg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(0, sy - sl.width, W, sl.width * 2);
      }

      const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.3, W * 0.5, H * 0.5, W * 0.9);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,2,8,0.75)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

/* ─── Reveal wrapper ─────────────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0, as = "div" }) {
  const [ref, visible] = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ value, suffix, label, delay }) {
  const [ref, visible] = useReveal(0.4);
  const count = useCountUp(value, visible);
  return (
    <div
      ref={ref}
      className={`stat-card reveal ${visible ? "reveal-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h2>
        {count.toLocaleString()}
        {suffix}
      </h2>
      <p>{label}</p>
    </div>
  );
}

/* ─── Decode text animation ──────────────────────────────────────────────── */
function DecodeText({ text, startDelay = 0 }) {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, " "));
  const glyphs = "!<>-_\\/[]{}—=+*^?#0123456789";

  useEffect(() => {
    let frame = 0;
    let raf;
    const totalFrames = 28;
    const timer = setTimeout(() => {
      function tick() {
        frame++;
        const progress = frame / totalFrames;
        const revealCount = Math.floor(progress * text.length);
        const next = text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "\n") return char;
            if (i < revealCount) return char;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");
        setDisplay(next);
        if (frame < totalFrames) {
          raf = requestAnimationFrame(() => setTimeout(tick, 28));
        } else {
          setDisplay(text);
        }
      }
      tick();
    }, startDelay);

    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{display}</>;
}

/* ─── Home component ─────────────────────────────────────────────────────── */
function Home() {
  const heroCanvasRef = useRef(null);
  const navigate = useNavigate();
  useHeroBg(heroCanvasRef);

  const services = [
    { icon: <FaShieldAlt />, title: "Threat Intelligence",     desc: "Real-time monitoring and analysis of cyber threats." },
    { icon: <FaBug />,       title: "Malware Analysis",        desc: "Identify and investigate malicious software." },
    { icon: <FaLock />,      title: "Security Audits",         desc: "Assess vulnerabilities before attackers do." },
    { icon: <FaServer />,    title: "SOC Monitoring",          desc: "24/7 Security Operations Center monitoring." },
    { icon: <FaGlobe />,     title: "Dark Web Tracking",       desc: "Monitor stolen credentials and leaked data." },
    { icon: <FaUserSecret />,title: "Incident Response",       desc: "Rapid response to cyber incidents." },
    { icon: <FaSearch />,    title: "Vulnerability Assessment",desc: "Identify security weaknesses and prioritize remediation efforts." },
    { icon: <FaNetworkWired />, title: "Network Security",     desc: "Protect networks from unauthorized access, attacks, and data breaches." },
  ];

  const whyChooseUs = [
    { title: "Real-Time Detection",    desc: "Threats are flagged the moment they surface, not hours later." },
    { title: "Analyst-Verified Intel", desc: "Every alert is reviewed by a human analyst before it reaches you." },
    { title: "Built for Scale",        desc: "From single servers to global infrastructure, monitoring scales with you." },
    { title: "Transparent Reporting",  desc: "Clear, jargon-free reports your whole team can act on." },
  ];

  const team = [
    { name: "Sarah Mitchell", role: "Chief Security Officer", img: z6 },
    { name: "Daniel Reyes",   role: "Lead Threat Analyst",    img: z4 },
    { name: "Priya Nair",     role: "Malware Researcher",     img: z5 },
    { name: "Tom Becker",     role: "Incident Response Lead", img: z3 },
  ];

  const feed = [
    { label: "Ransomware Activity", level: "critical", text: "Critical" },
    { label: "Phishing Campaign",   level: "high",     text: "High"     },
    { label: "Botnet Network",      level: "medium",   text: "Medium"   },
    { label: "DDoS Attempts",       level: "low",      text: "Low"      },
  ];

  return (
    <div className="home">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="hero">
        <canvas ref={heroCanvasRef} className="hero-canvas" aria-hidden="true" />

        <div className="radar-field" aria-hidden="true">
          <span className="radar-ring ring-1" />
          <span className="radar-ring ring-2" />
          <span className="radar-ring ring-3" />
          <span className="radar-sweep" />
        </div>

        <div className="hero-content">
          <span className="hero-tag">
            <span className="pulse-dot" />
            Live threat monitoring active
          </span>

          <h1>
            <DecodeText text="Cyber Intelligence &" />
            <br />
            <DecodeText text="Threat Detection Platform" startDelay={150} />
          </h1>

          <p className="hero-sub">
            Protect your organization from cyber attacks using real-time
            threat intelligence, security monitoring and advanced analytics.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/404")}>
              Get Started
            </button>
            <button className="secondary-btn" onClick={() => navigate("/404")}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section className="stats">
        <StatCard value={10}   suffix="M+" label="Threats Analyzed"   delay={0}   />
        <StatCard value={99.9} suffix="%"  label="Detection Accuracy" delay={80}  />
        <StatCard value={24}   suffix="/7" label="Monitoring"         delay={160} />
        <StatCard value={150}  suffix="+"  label="Global Clients"     delay={240} />
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────────────── */}
      <section className="about" id="about">
        <Reveal className="about-image" as="div">
          <img src={z1} alt="CyberIntel Security Operations Center" />
        </Reveal>
        <Reveal className="about-content" delay={120}>
          <span className="eyebrow">About Us</span>
          <h2>Watching the threat landscape so you don't have to</h2>
          <p>
            CyberIntel was founded by a team of analysts who got tired of
            finding out about breaches after the damage was done. Today we
            run a global monitoring network that tracks emerging threats,
            leaked credentials, and active campaigns across the open,
            deep, and dark web.
          </p>
          <p>
            Our mission is simple: give organizations of every size the
            same visibility into their threat exposure that nation-state
            security teams have, without the overhead of building it
            in-house.
          </p>
        </Reveal>
      </section>

      {/* ── WHY US ──────────────────────────────────────────────────────── */}
      <section className="why-us" id="why-us">
        <Reveal className="section-title" as="div">
          <h2>Why Organizations Choose CyberIntel</h2>
          <p>Security teams don't need more noise. They need signal.</p>
        </Reveal>
        <div className="why-us-grid">
          <Reveal className="why-us-image">
            <img src={z2} alt="Live threat monitoring dashboard" />
          </Reveal>
          <div className="why-us-list">
            {whyChooseUs.map((item, index) => (
              <Reveal key={index} className="why-us-item" delay={index * 90}>
                <FaCheckCircle className="why-us-icon" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section className="services" id="services">
        <Reveal className="section-title" as="div">
          <h2>Cyber Intelligence Services</h2>
          <p>Advanced security solutions for modern businesses.</p>
        </Reveal>
        <div className="services-grid">
          {services.map((service, index) => (
            <Reveal key={index} className="service-card" delay={index * 70}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────────────── */}
      <section className="team" id="team">
        <Reveal className="section-title" as="div">
          <h2>Meet the Analysts</h2>
          <p>The people behind every alert you receive.</p>
        </Reveal>
        <div className="team-grid">
          {team.map((member, index) => (
            <Reveal key={index} className="team-card" delay={index * 80}>
              <div className="team-image">
                <img src={member.img} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <div className="team-socials">
                <FaLinkedin />
                <FaTwitter />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── THREAT FEED ─────────────────────────────────────────────────── */}
      <section className="threat-feed" id="threats">
        <Reveal className="section-title" as="div">
          <h2>Latest Threat Feed</h2>
        </Reveal>
        <Reveal className="feed-table" as="div">
          {feed.map((row, index) => (
            <div className="feed-row" key={index}>
              <span className="feed-label">
                <span className={`feed-pulse ${row.level}`} />
                {row.label}
              </span>
              <span className={row.level}>{row.text}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <Reveal className="cta" as="section">
        <h2>Ready to Secure Your Infrastructure?</h2>
        <p>Join organizations worldwide using CyberIntel.</p>
        <button onClick={() => navigate("/404")}>Start Monitoring</button>
      </Reveal>

    </div>
  );
}

export default Home;