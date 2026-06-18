import { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

import "./Contact.css";
import { Reveal } from "../useScrollFx";
import z4 from "../../assets/z4.webp";
import { useNavigate } from "react-router-dom";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  function showToast(message, type = "error") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "name") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "email") {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (!value) {
        setEmailError("");
      } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim())) {
        setEmailError("Enter a valid Gmail address (e.g. you@gmail.com)");
      } else {
        setEmailError("");
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!/^[A-Za-z\s]+$/.test(form.name.trim())) {
      showToast("Name should contain only letters and spaces.");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email.trim())) {
      showToast("Please enter a valid Gmail address (e.g. you@gmail.com)");
      return;
    }

    if (!form.message.trim()) {
      showToast("Please enter a message before sending.");
      return;
    }

    setSubmitted(true);
    showToast("Message sent successfully!", "success");
  }

  const channels = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      detail: "contact@stackly.com",
      note: "Replies within one business day",
    },
    {
      icon: <FaPhoneAlt />,
      title: "Phone",
      detail: "+91 98765 43210",
      note: "24/7 for active incidents",
    },
    {
      icon: <FaClock />,
      title: "Incident Hotline",
      detail: "Priority response line",
      note: "For clients with an active breach",
    },
  ];

  const offices = [
    {
      city: "San Francisco",
      region: "Headquarters",
      address: "120 Mission St, Suite 400",
    },
    {
      city: "London",
      region: "EMEA Operations",
      address: "14 Finsbury Square",
    },
    {
      city: "Singapore",
      region: "APAC Operations",
      address: "8 Marina View, Level 22",
    },
  ];

  const faqs = [
    {
      q: "How quickly can monitoring go live?",
      a: "Most clients are fully onboarded within five business days, depending on environment complexity.",
    },
    {
      q: "Do you work with smaller organizations?",
      a: "Yes. Our Essential tier is built specifically for teams without an in-house security function.",
    },
    {
      q: "Can you respond to an incident in progress?",
      a: "Yes. Use the incident hotline above for priority routing directly to a responder.",
    },
  ];

  return (
    <div className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <div className="radar-field" aria-hidden="true">
          <span className="radar-ring ring-1" />
          <span className="radar-ring ring-2" />
          <span className="radar-ring ring-3" />
          <span className="radar-sweep" />
        </div>

        <div className="contact-hero-content">
          <span className="hero-tag">
            <span className="pulse-dot" />
            Response team standing by
          </span>

          <h1>Talk to an Analyst, Not a Ticket Queue</h1>

          <p className="hero-sub">
            Whether you're evaluating coverage or responding to an active
            incident, a real person reads every message that comes through
            here.
          </p>
        </div>
      </section>

      {/* FORM + CHANNELS */}
      <section className="contact-main" id="form">
        <Reveal className="contact-form-wrap" as="div">
          <h2>Send a Message</h2>
          <p>
            Tell us about your environment and what you're looking to solve.
          </p>

          {submitted ? (
            <div className="contact-success">
              <FaPaperPlane />
              <h3>Message Sent</h3>
              <p>
                An analyst will follow up at the email address you provided.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    required
                  />
                </label>

                <label>
                  Company
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                  />
                </label>
              </div>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@gmail.com"
                  className={
                    emailError
                      ? "input-error"
                      : form.email && !emailError
                      ? "input-valid"
                      : ""
                  }
                  required
                />
                {emailError && (
                  <span className="field-error-msg">{emailError}</span>
                )}
                {!emailError && form.email && (
                  <span className="field-success-msg">Looks good!</span>
                )}
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe what you need…"
                  required
                />
              </label>

              <button type="submit" className="primary-btn">
                Send Message
              </button>
            </form>
          )}
        </Reveal>

        <div className="contact-channels">
          {channels.map((channel, index) => (
            <Reveal
              key={index}
              className="channel-card"
              delay={index * 90}
            >
              <div className="channel-icon">{channel.icon}</div>

              <div>
                <h3>{channel.title}</h3>
                <p className="channel-detail">{channel.detail}</p>
                <p className="channel-note">{channel.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OFFICES */}
      <section className="contact-offices" id="offices">
        <Reveal className="section-title" as="div">
          <span className="eyebrow">Where We Are</span>
          <h2>Global Footprint, Local Response</h2>
        </Reveal>

        <div className="offices-grid">
          <Reveal className="offices-image" as="div">
            <img src={z4} alt="CyberIntel global operations" />
          </Reveal>

          <div className="offices-list">
            {offices.map((office, index) => (
              <Reveal
                key={index}
                className="office-card"
                delay={index * 90}
              >
                <FaMapMarkerAlt className="office-icon" />

                <div>
                  <h3>{office.city}</h3>
                  <span className="office-region">
                    {office.region}
                  </span>
                  <p>{office.address}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <Reveal className="contact-cta" as="section">
        <div className="faq-list">
          <span className="eyebrow">Before You Write In</span>
          <h2>Common Questions</h2>

          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="contact-cta-panel">
          <h2>Still have questions?</h2>
          <p>
            Our team can walk you through coverage options on a short
            call.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/404")}
          >
            Schedule a Call
          </button>
        </div>
      </Reveal>

      {/* TOAST CONTAINER */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon" aria-hidden="true">
              {t.type === "success" ? "✓" : "✕"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contact;