import React from "react";
import { Link } from "react-router-dom";

const HERO_IMAGE =
  "/cafe-fausse-01-home-hero.png";

export default function Home() {
  return (
    <div>
      <section
        className="hero"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
        <div className="hero__content">
          <p className="eyebrow">Two Michelin Stars · Washington, DC</p>
          <h1>Café Fausse</h1>
          <p>
            A Washington dining room where Italian technique meets a restless kitchen.
          </p>
          <div className="hero__cta">
            <Link className="btn" to="/reservations">
              Reserve a Table
            </Link>
            <Link className="btn btn--outline" style={{ borderColor: "var(--cream)", color: "var(--cream)" }} to="/menu">
              View Menu
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            <div className="info-card">
              <p className="eyebrow">Address</p>
              <h3>Find Us</h3>
              <p>
                1234 Culinary Ave, Suite 100
                <br />
                Washington, DC 20002
              </p>
            </div>
            <div className="info-card">
              <p className="eyebrow">Hours</p>
              <h3>When We're Open</h3>
              <p>
                Monday – Saturday
                <br />
                5:00 PM – 11:00 PM
              </p>
              <p>
                Sunday
                <br />
                5:00 PM – 9:00 PM
              </p>
            </div>
            <div className="info-card">
              <p className="eyebrow">Contact</p>
              <h3>Reach Us</h3>
              <p>(202) 555-4567</p>
              <Link className="btn btn--outline" to="/reservations" style={{ marginTop: "0.5rem" }}>
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ background: "var(--cream-deep)" }}>
        <div className="container section-heading">
          <p className="eyebrow">Explore</p>
          <h2>A Full Evening Awaits</h2>
        </div>
        <div className="container grid grid--4">
          {[
            { to: "/menu", label: "Menu" },
            { to: "/about", label: "About Us" },
            { to: "/gallery", label: "Gallery" },
            { to: "/reservations", label: "Reservations" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="info-card"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              <h3 style={{ color: "var(--wine)" }}>{item.label}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
