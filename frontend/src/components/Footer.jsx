import React, { useState } from "react";
import { signUpForNewsletter } from "../api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    try {
      const data = await signUpForNewsletter(email);
      setStatus({ type: "success", message: data.message });
      setEmail("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col">
          <div className="footer__mark">Café Fausse</div>
          <p style={{ marginTop: "0.75rem" }}>
            1234 Culinary Ave, Suite 100
            <br />
            Washington, DC 20002
            <br />
            (202) 555-4567
          </p>
        </div>

        <div className="footer__col">
          <h4>Hours</h4>
          <p>Mon–Sat: 5:00 PM – 11:00 PM</p>
          <p>Sunday: 5:00 PM – 9:00 PM</p>
          <br />          
          <p>Two Michelin Stars</p><p> Restaurant of the Year, 2023</p>
        </div>

        <div className="footer__col" style={{ minWidth: "260px" }}>
          <h4>Join Our Newsletter</h4>
          <p>Special events, seasonal menus, and more.</p>
          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="footer-email" className="visually-hidden" style={{ display: "none" }}>
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "..." : "Sign Up"}
            </button>
          </form>
          {status && (
            <p
              role="status"
              style={{
                marginTop: "0.6rem",
                fontSize: "0.85rem",
                color: status.type === "success" ? "#c7dcb8" : "#e3a9a9",
              }}
            >
              {status.message}
            </p>
          )}
        </div>
      </div>

      <div className="container footer__bottom">
        © {new Date().getFullYear()} Café Fausse. All rights reserved.
      </div>
    </footer>
  );
}
