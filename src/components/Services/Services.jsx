import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaBug,
  FaLock,
  FaServer,
  FaGlobe,
  FaUserSecret,
  FaSearch,
  FaClipboardCheck,
  FaRocket,
  FaSyncAlt,
  FaCheck,
} from "react-icons/fa";

import "./Services.css";
import { Reveal, StatCard } from "../useScrollFx";
import z2 from "../../assets/z2.webp";
import z7 from "../../assets/z7.webp";
import z8 from "../../assets/z8.webp";
import z9 from "../../assets/z9.webp";
import z10 from "../../assets/z10.webp";
import z11 from "../../assets/z11.webp";
import z12 from "../../assets/z12.webp";

function Services() {
  const [activeProcess, setActiveProcess] = useState(0);
  const navigate = useNavigate();

  // Each entry below is the full "case file" for one discipline — a short
  // summary for scanning, a longer description for the reader who wants
  // the real depth, a capability list, a headline metric, and a hint for
  // the image that should eventually replace the placeholder.
  const services = [
    {
      code: "TI-01",
      icon: <FaShieldAlt />,
      title: "Threat Intelligence",
      summary:
        "Continuous collection and correlation of indicators across open, deep, and dark web sources.",
      description:
        "Most breaches begin with reconnaissance attackers complete long before the first exploit lands. Our threat intelligence practice tracks adversary chatter, leaked credentials, infrastructure reuse, and emerging tooling across more than thirty open, deep, and dark web sources, then correlates all of it against your specific asset list. Instead of a generic feed, you get a watchlist tuned to your domains, your executives, and your supply chain, refreshed hourly and ranked by how exploitable each finding actually is.",
      capabilities: [
        "Indicator-of-compromise feeds refreshed hourly",
        "Sector-specific threat briefings delivered weekly",
        "Custom watchlists for domains, executives, and vendors",
        "Adversary infrastructure and TTP tracking",
        "Direct feed into your SOC and SIEM tooling",
      ],
      metric: { value: "40K+", label: "indicators correlated daily" },
      imageHint: z7,
    },
    {
      code: "MA-02",
      icon: <FaBug />,
      title: "Malware Analysis",
      summary:
        "Static and dynamic analysis of suspicious binaries to identify behavior, family, and origin.",
      description:
        "When a suspicious binary lands in your environment, guessing isn't an option. Our analysts detonate samples inside isolated sandboxes, trace exactly what they do, and reverse engineer the parts that matter: how the malware behaves, who likely built it, and how it talks back to its operators. Every engagement ends with something your team can act on immediately, not just a write-up, but detection rules ready to ship.",
      capabilities: [
        "Isolated sandbox detonation with full network capture",
        "Static and dynamic reverse engineering",
        "Malware family and origin attribution",
        "Custom YARA and Sigma rule generation",
        "Written report mapped to MITRE ATT&CK",
      ],
      metric: { value: "6 hrs", label: "average report turnaround" },
      imageHint: z8,
    },
    {
      code: "SA-03",
      icon: <FaLock />,
      title: "Security Audits",
      summary:
        "Structured assessments of infrastructure, applications, and policy against real attacker behavior.",
      description:
        "Checklists don't stop attackers; behavior does. Our audits pair manual testing with automated scanning to assess your infrastructure, applications, and policies the way a real adversary would approach them — not just whether a control exists, but whether it would actually hold under pressure. You leave with a prioritized list of what to fix first, walked through line by line with your own engineering team.",
      capabilities: [
        "External and internal scope, your choice or both",
        "Manual exploitation alongside automated scanning",
        "Application, network, and cloud configuration review",
        "Findings prioritized by real-world exploitability",
        "Live remediation walkthrough with your engineers",
      ],
      metric: { value: "98%", label: "of critical findings closed within 30 days" },
      imageHint: z9,
    },
    {
      code: "SM-04",
      icon: <FaServer />,
      title: "SOC Monitoring",
      summary:
        "A staffed Security Operations Center watching your environment around the clock.",
      description:
        "An alert at 3 a.m. is worthless if no one is awake to read it. Our Security Operations Center is staffed around the clock by analysts who review activity in your environment in real time, not automated rules firing into an empty queue. When something looks wrong, a person investigates it before it becomes your problem, and every month you get a review that turns raw alert volume into a clear picture of where you actually stand.",
      capabilities: [
        "24/7 human-reviewed alerting, not just automated triage",
        "Tiered escalation paths matched to severity",
        "Detection tuning built around your environment",
        "Monthly posture reviews with trend analysis",
        "A named analyst on call, not a ticket queue",
      ],
      metric: { value: "<9 min", label: "mean time to triage an alert" },
      imageHint: z10,
    },
    {
      code: "DW-05",
      icon: <FaGlobe />,
      title: "Dark Web Tracking",
      summary:
        "Surveillance of marketplaces, forums, and leak sites for your organization's exposed data.",
      description:
        "Stolen credentials and leaked data rarely surface where you'd expect to find them. We monitor marketplaces, criminal forums, paste sites, and leak channels for anything tied to your brand, your domains, or your employees, and we move on it before it spreads. When we find exposed data, we don't just send an alert; we help coordinate the takedown and the credential reset so the exposure actually closes.",
      capabilities: [
        "Credential and data leak alerts as they surface",
        "Brand, domain, and executive impersonation monitoring",
        "Marketplace and forum surveillance, including invite-only spaces",
        "Takedown coordination with hosts and registrars",
        "Exposure reports tied to specific employees or systems",
      ],
      metric: { value: "24 hrs", label: "from listing to client alert" },
      imageHint: z11,
    },
    {
      code: "IR-06",
      icon: <FaUserSecret />,
      title: "Incident Response",
      summary:
        "On-call responders who contain, investigate, and help you recover from active incidents.",
      description:
        "When an incident is active, every hour without a clear plan costs you more. Our responders contain the threat, preserve evidence, and rebuild a precise timeline of what happened and how, while keeping your team informed instead of in the dark. Once the incident is closed, you get a hardening plan built from what we actually found in your environment, not a generic checklist pulled off a shelf.",
      capabilities: [
        "Sub-hour responder dispatch, 24/7/365",
        "Containment that preserves forensic evidence",
        "Full forensic timeline reconstruction",
        "Coordination with legal, insurance, and law enforcement as needed",
        "Post-incident hardening plan with owners and deadlines",
      ],
      metric: { value: "<1 hr", label: "responder dispatch, any hour" },
      imageHint: z12,
    },
  ];

  const process = [
    {
      icon: <FaSearch />,
      title: "Assess",
      desc: "We map your attack surface, assets, and existing controls to understand real exposure.",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Plan",
      desc: "Findings become a prioritized roadmap, scoped to risk, budget, and your team's capacity.",
    },
    {
      icon: <FaRocket />,
      title: "Deploy",
      desc: "Monitoring, tooling, and response playbooks go live with minimal disruption to operations.",
    },
    {
      icon: <FaSyncAlt />,
      title: "Refine",
      desc: "We tune detections against your environment continuously as threats and infrastructure evolve.",
    },
  ];

  const tiers = [
    {
      name: "Essential",
      tagline: "For teams establishing baseline visibility",
      features: [
        "Threat intel feed access",
        "Monthly audit summary",
        "Email alerting",
        "Standard support response times",
      ],
    },
    {
      name: "Professional",
      tagline: "For teams running production-critical systems",
      features: [
        "Everything in Essential",
        "24/7 SOC monitoring",
        "Dark web tracking",
        "Quarterly audits",
      ],
      featured: true,
    },
    {
      name: "Enterprise",
      tagline: "For organizations with complex, distributed infrastructure",
      features: [
        "Everything in Professional",
        "Dedicated incident response team",
        "Custom SLAs",
        "On-site engagement",
      ],
    },
  ];

  return (
    <div className="services-page">
      {/* SECTION 1 — HERO */}
      <section className="services-hero">
        <div className="radar-field" aria-hidden="true">
          <span className="radar-ring ring-1" />
          <span className="radar-ring ring-2" />
          <span className="radar-ring ring-3" />
          <span className="radar-sweep" />
        </div>

        <div className="services-hero-content">
          <span className="hero-tag">
            <span className="pulse-dot" />
            Full-spectrum coverage
          </span>
          <h1>Services built around what attackers actually do</h1>
          <p className="hero-sub">
            Six disciplines, one coordinated platform. Every service below feeds the same
            intelligence layer, so nothing you deploy works in isolation.
          </p>
        </div>

        <div className="services-stats">
          <StatCard value={6} suffix="" label="Core Disciplines" delay={0} />
          <StatCard value={24} suffix="/7" label="Active Coverage" delay={80} />
          <StatCard value={150} suffix="+" label="Clients Protected" delay={160} />
        </div>
      </section>

      {/* SECTION 2 — SERVICE DOSSIER (replaces the old catalog grid) */}
      <section className="service-dossier" id="services">
        <Reveal className="section-title" as="div">
          <span className="eyebrow">Capability Dossier</span>
          <h2>Six disciplines, read in full</h2>
          <p>
            No summaries pretending to be answers. Here's exactly what each service does,
            how it works day to day, and what lands in your inbox.
          </p>
        </Reveal>

        <div className="dossier-rows">
          {services.map((service, index) => (
            <Reveal
              key={service.code}
              as="article"
              className={`dossier-row ${index % 2 === 1 ? "dossier-row-reverse" : ""}`}
              delay={Math.min(index * 60, 240)}
            >
              <div className="dossier-image" aria-hidden="true">
                <div className="dossier-image-pattern" />
                <div className="dossier-scanline" />
                <div className="dossier-image-corner corner-tl" />
                <div className="dossier-image-corner corner-br" />

                {/* Replace icon + hint span with this */}
                {typeof service.imageHint === "string" && service.imageHint.startsWith("Suggested") ? (
                  <>
                    <div className="dossier-image-icon">{service.icon}</div>
                    <span className="dossier-image-hint">{service.imageHint}</span>
                  </>
                ) : (
                  <img
                    src={service.imageHint}
                    alt={service.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                )}
              </div>

              <div className="dossier-content" data-watermark="CLASSIFIED">
                <span className="dossier-stamp">Case File · {service.code}</span>

                <div className="dossier-heading">
                  <span className="dossier-heading-icon">{service.icon}</span>
                  <h3>{service.title}</h3>
                </div>

                <p className="dossier-summary">{service.summary}</p>
                <p className="dossier-description">{service.description}</p>

                <ul className="dossier-capabilities">
                  {service.capabilities.map((point, i) => (
                    <li key={i}>
                      <FaCheck className="list-check" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="dossier-metric">
                  <span className="dossier-metric-value">{service.metric.value}</span>
                  <span className="dossier-metric-label">{service.metric.label}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTION 3 — PROCESS */}
      <section className="services-process" id="process">
        <Reveal className="section-title" as="div">
          <span className="eyebrow">How We Work</span>
          <h2>From First Scan to Standing Defense</h2>
          <p>The same four-stage cycle runs underneath every engagement, however large.</p>
        </Reveal>

        <div className="process-layout">
          <div className="process-steps">
            {process.map((step, index) => (
              <button
                key={index}
                className={`process-step ${activeProcess === index ? "process-step-active" : ""}`}
                onClick={() => setActiveProcess(index)}
              >
                <span className="process-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="process-icon">{step.icon}</div>
                <div className="process-text">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <Reveal className="process-visual" delay={120}>
            <img src={z2} alt="Live monitoring dashboard during the active engagement stage" />
            <div className="process-visual-caption">
              <span className="pulse-dot" />
              Stage {activeProcess + 1}: {process[activeProcess].title}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 4 — ENGAGEMENT TIERS + CTA */}
      <section className="services-tiers" id="tiers">
        <Reveal className="section-title" as="div">
          <span className="eyebrow">Engagement Tiers</span>
          <h2>Choose Your Level of Coverage</h2>
          <p>Every tier shares the same detection engine. Higher tiers add depth, not a different product.</p>
        </Reveal>

        <div className="tiers-grid">
          {tiers.map((tier, index) => (
            <Reveal
              key={index}
              className={`tier-card ${tier.featured ? "tier-featured" : ""}`}
              delay={index * 90}
            >
              {tier.featured && <span className="tier-badge">Most Coverage</span>}
              <h3>{tier.name}</h3>
              <p className="tier-tagline">{tier.tagline}</p>
              <ul>
                {tier.features.map((feature, i) => (
                  <li key={i}>
                    <FaCheck className="list-check" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={tier.featured ? "primary-btn" : "secondary-btn"}
                onClick={() => navigate("/404")}
              >
                Talk to Us
              </button>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;