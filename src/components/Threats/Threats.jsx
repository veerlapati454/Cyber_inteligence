import { useState } from "react";
import {
  FaVirus,
  FaFish,
  FaNetworkWired,
  FaBolt,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from "react-icons/fa";

import "./Threats.css";
import { Reveal, StatCard, DecodeText } from "../useScrollFx";
import z3 from "../../assets/z3.webp";

function Threats() {
  const [filter, setFilter] = useState("all");

  // Full profile for each threat category: a quick summary, the longer
  // explanation, the warning signs a team would actually see, a five-stage
  // attack chain, trend direction, a supporting metric, and a hint for the
  // image that should eventually replace the placeholder.
  const threatProfiles = [
    {
      code: "TC-01",
      icon: <FaVirus />,
      title: "Ransomware",
      summary: "Encryption-based extortion targeting backups and shared drives first.",
      description:
        "Modern ransomware crews spend days inside a network before triggering encryption, quietly disabling backups, exfiltrating data for double extortion, and timing detonation for the hour your team is least staffed. By the time files are visibly encrypted, the operators have usually already taken what they came for.",
      indicators: [
        "Backup jobs failing or disappearing without explanation",
        "Unusual volume of file renames across shared drives",
        "New admin accounts created outside change windows",
        "Large outbound transfers to unfamiliar cloud storage",
        "Security tooling disabled or uninstalled remotely",
      ],
      chain: [
        "Initial Access",
        "Privilege Escalation",
        "Data Exfiltration",
        "Backup Destruction",
        "Encryption & Ransom",
      ],
      trendDirection: "up",
      trendLabel: "+18% this month",
      metricExtra: { value: "4.5 days", label: "average dwell time before detonation" },
      imageHint: "Suggested image — encrypted file directory or a ransom note screen",
    },
    {
      code: "TC-02",
      icon: <FaFish />,
      title: "Phishing",
      summary: "Credential and payment fraud delivered through spoofed identities.",
      description:
        "The most convincing phishing kits today clone real login pages pixel for pixel and proxy traffic through the genuine service in real time, so multi-factor codes get captured the instant they're entered. Targeting has shifted from mass blasts toward small, researched batches aimed at the finance and HR staff who can move money or data on request.",
      indicators: [
        "Login attempts immediately followed by MFA prompts from unfamiliar IPs",
        "Emails impersonating executives requesting urgent transfers",
        "Lookalike domains registered shortly before a campaign",
        "Spike in password reset requests outside business hours",
        "Reports of cloned SSO or webmail login pages",
      ],
      chain: [
        "Recon & Targeting",
        "Lookalike Setup",
        "Lure Delivery",
        "Credential Capture",
        "Account Takeover",
      ],
      trendDirection: "up",
      trendLabel: "+9% this month",
      metricExtra: { value: "94 sec", label: "average time to first click" },
      imageHint: "Suggested image — spoofed login page beside the real one",
    },
    {
      code: "TC-03",
      icon: <FaNetworkWired />,
      title: "Botnets",
      summary: "Compromised device networks used for relay, mining, and DDoS launches.",
      description:
        "Botnets built from poorly secured routers, cameras, and other IoT devices give attackers a disposable layer of infrastructure, traffic that looks like it's coming from thousands of ordinary homes instead of one operator. Once recruited, a device is rarely used just once; it gets rotated between credential stuffing, DDoS launches, and cryptomining depending on what the operator needs that week.",
      indicators: [
        "Smart devices communicating with unfamiliar external IPs",
        "Unexplained spikes in outbound traffic from IoT subnets",
        "Devices that won't accept firmware updates or reboot cleanly",
        "Default credentials still active on network hardware",
        "DNS requests resolving to known command-and-control domains",
      ],
      chain: [
        "Device Scanning",
        "Credential Exploit",
        "Malware Implant",
        "C2 Check-in",
        "Task Assignment",
      ],
      trendDirection: "flat",
      trendLabel: "Stable",
      metricExtra: { value: "50K+", label: "devices recruited globally, per day (est.)" },
      imageHint: "Suggested image — world map of botnet node distribution",
    },
    {
      code: "TC-04",
      icon: <FaBolt />,
      title: "DDoS",
      summary: "Volumetric and application-layer floods aimed at availability.",
      description:
        "Distributed denial-of-service attacks no longer need a single massive botnet to be disruptive. Application-layer floods can take a service offline with a fraction of the traffic by targeting the most expensive part of a request, like a search query or a login form. The goal usually isn't data theft, it's leverage: taking a service down right before a launch, a sale, or a ransom deadline.",
      indicators: [
        "Sudden, sustained spike in requests to a single endpoint",
        "Traffic concentrated in unusual geographies or ASNs",
        "Login or search endpoints slowing disproportionately to volume",
        "Timing that lines up with a launch, sale, or extortion attempt",
        "CDN or WAF logs showing repeated requests with identical headers",
      ],
      chain: [
        "Target Recon",
        "Traffic Assembly",
        "Flood Launch",
        "Adaptive Targeting",
        "Extortion or Distraction",
      ],
      trendDirection: "down",
      trendLabel: "−4% this month",
      metricExtra: { value: "1.2 Tbps", label: "largest flood mitigated this quarter" },
      imageHint: "Suggested image — real-time traffic graph during a mitigated flood",
    },
  ];

  const trendIcon = (direction) => {
    if (direction === "up") return <FaArrowUp />;
    if (direction === "down") return <FaArrowDown />;
    return <FaMinus />;
  };

  const feed = [
    { label: "LockBit-derivative ransomware surge", sector: "Healthcare", level: "critical", text: "Critical", time: "2m ago" },
    { label: "Credential phishing kit mimicking SSO portals", sector: "Finance", level: "high", text: "High", time: "14m ago" },
    { label: "Mirai-variant botnet recruiting IoT devices", sector: "Telecom", level: "medium", text: "Medium", time: "41m ago" },
    { label: "Low-volume DDoS probing on edge nodes", sector: "Retail", level: "low", text: "Low", time: "1h ago" },
    { label: "Leaked credential batch posted to forum", sector: "Logistics", level: "high", text: "High", time: "2h ago" },
    { label: "Suspicious lateral movement contained by SOC", sector: "Government", level: "critical", text: "Critical", time: "3h ago" },
  ];

  const filteredFeed = filter === "all" ? feed : feed.filter((row) => row.level === filter);

  const filters = [
    { key: "all", label: "All" },
    { key: "critical", label: "Critical" },
    { key: "high", label: "High" },
    { key: "medium", label: "Medium" },
    { key: "low", label: "Low" },
  ];

  return (
    <div className="threats-page">
      {/* SECTION 1 — HERO */}
      <section className="threats-hero">
        <div className="scan-grid" aria-hidden="true" />

        <div className="threats-hero-content">
          <span className="hero-tag">
            <span className="pulse-dot critical" />
            Live feed scanning
          </span>
          <h1>
            <DecodeText text="The Threat Landscape," />
            <br />
            <DecodeText text="As It Happens" startDelay={150} />
          </h1>
          <p className="hero-sub">
            Every entry below is sourced from active monitoring across our client base,
            open intelligence feeds, and dark web surveillance.
          </p>
        </div>

        <div className="threats-stats">
          <StatCard value={1240} suffix="" label="Active Indicators Today" delay={0} />
          <StatCard value={37} suffix="" label="Critical Alerts (7d)" delay={80} />
          <StatCard value={12} suffix="" label="Sectors Monitored" delay={160} />
        </div>
      </section>

      {/* SECTION 2 — THREAT PROFILES (was a 4-card category grid) */}
      <section className="threats-categories" id="categories">
        <Reveal className="section-title" as="div">
          <span className="eyebrow">Threat Categories</span>
          <h2>Where pressure is building</h2>
          <p>
            Four categories account for the overwhelming majority of incidents we track.
            Here's how each one actually plays out, not just that it exists.
          </p>
        </Reveal>

        <div className="threat-rows">
          {threatProfiles.map((profile, index) => (
            <Reveal
              key={profile.code}
              as="article"
              className={`threat-row ${index % 2 === 1 ? "threat-row-reverse" : ""}`}
              delay={Math.min(index * 70, 280)}
            >
              <div className="threat-image" data-trend={profile.trendDirection} aria-hidden="true">
                <div className="threat-image-pattern" />
                <div className="threat-scanline" />
                <div className="threat-image-corner corner-tl" />
                <div className="threat-image-corner corner-br" />
                <div className="threat-image-icon">{profile.icon}</div>
                <span className="threat-image-hint">{profile.imageHint}</span>
              </div>

              <div className="threat-content" data-trend={profile.trendDirection}>
                <div className="threat-tagrow">
                  <span className="threat-stamp">Threat Class · {profile.code}</span>
                  <span className={`threat-trend trend-${profile.trendDirection}`}>
                    {trendIcon(profile.trendDirection)}
                    {profile.trendLabel}
                  </span>
                </div>

                <div className="threat-heading">
                  <span className="threat-heading-icon">{profile.icon}</span>
                  <h3>{profile.title}</h3>
                </div>

                <p className="threat-summary">{profile.summary}</p>
                <p className="threat-description">{profile.description}</p>

                <div className="threat-block">
                  <span className="threat-block-label">Warning signs</span>
                  <ul className="threat-indicators">
                    {profile.indicators.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="threat-block">
                  <span className="threat-block-label">Typical attack chain</span>
                  <ol className="threat-chain">
                    {profile.chain.map((step, i) => (
                      <li key={i}>
                        <span className="chain-index">{i + 1}</span>
                        <span className="chain-label">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="threat-metric">
                  <span className="threat-metric-value">{profile.metricExtra.value}</span>
                  <span className="threat-metric-label">{profile.metricExtra.label}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTION 3 — LIVE FEED */}
      <section className="threats-feed-section" id="feed">
        <Reveal className="section-title" as="div">
          <span className="eyebrow">Live Feed</span>
          <h2>Latest Detections</h2>
          <p>Filter by severity to focus on what needs attention first.</p>
        </Reveal>

        <Reveal className="feed-filters" as="div">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`feed-filter-btn ${filter === f.key ? "feed-filter-active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <Reveal className="feed-table-large" as="div">
          {filteredFeed.map((row, index) => (
            <div className="feed-row-large" key={index} style={{ animationDelay: `${index * 60}ms` }}>
              <span className={`feed-pulse ${row.level}`} />
              <div className="feed-row-main">
                <span className="feed-row-label">{row.label}</span>
                <span className="feed-row-sector">{row.sector}</span>
              </div>
              <span className="feed-row-time">{row.time}</span>
              <span className={`feed-severity ${row.level}`}>{row.text}</span>
            </div>
          ))}
          {filteredFeed.length === 0 && (
            <div className="feed-empty">
              <FaExclamationTriangle />
              No entries at this severity right now.
            </div>
          )}
        </Reveal>
      </section>

      {/* SECTION 4 — GLOBAL EXPOSURE + CTA */}
      <section className="threats-exposure" id="exposure">
        <Reveal className="exposure-image" as="div">
          <img src={z3} alt="Global threat exposure visualization" />
        </Reveal>

        <Reveal className="exposure-content" delay={120}>
          <span className="eyebrow">Global Exposure</span>
          <h2>Threats don't wait for business hours. Neither do we.</h2>
          <p>
            Our monitoring network spans every major time zone, correlating activity the
            moment it surfaces rather than batching it into a morning report.
          </p>
          <button className="primary-btn">Get a Live Briefing</button>
        </Reveal>
      </section>
    </div>
  );
}

export default Threats;