import React, { useState } from "react";
import { createReservation } from "../api";

const EMPTY_FORM = {
  date: "",
  time: "",
  numberOfGuests: 2,
  customerName: "",
  customerEmail: "",
  phoneNumber: "",
  newsletterSignup: false,
};

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function Reservations() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { type, message }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const errors = [];
    if (!form.customerName.trim()) errors.push("Please enter the name for the reservation.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      errors.push("Please enter a valid email address, such as you@example.com.");
    }
    if (!form.date) errors.push("Please choose a date.");
    if (!form.time) errors.push("Please choose a time.");
    const guests = Number(form.numberOfGuests);
    if (!guests || guests < 1 || guests > 8) {
      errors.push("Please enter the number of guests, from 1 to 8.");
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);

    const errors = validate();
    if (errors.length) {
      setResult({ type: "error", message: errors.join(" ") });
      return;
    }

    const timeSlot = `${form.date}T${form.time}:00`;

    setSubmitting(true);
    try {
      const data = await createReservation({
        customer_name: form.customerName.trim(),
        customer_email: form.customerEmail.trim(),
        phone_number: form.phoneNumber.trim() || null,
        time_slot: timeSlot,
        number_of_guests: Number(form.numberOfGuests),
        newsletter_signup: form.newsletterSignup,
      });
      setResult({ type: "success", message: data.message });
      setForm(EMPTY_FORM);
    } catch (err) {
      setResult({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section">
      <div className="container section-heading">
        <p className="eyebrow">Book a Table</p>
        <h1>Reserve a Table</h1>
        <p>Choose a date and time, tell us how many are joining you, and 
          we will assign your table. Confirmation appears on screen as soon as the booking is accepted.</p>
          <p>Since the Michelin announcement, evening seatings fill quickly. Booking two weeks ahead is worth doing for weekend tables.</p>
      </div>

      <div className="container res-layout">
        <div>
          {result && (
            <div className={`form-message form-message--${result.type}`} role="status">
              {result.message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  min={todayISO()}
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="time">Time</label>
                <input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="guests">Number of Guests</label>
              <select
                id="guests"
                value={form.numberOfGuests}
                onChange={(e) => update("numberOfGuests", e.target.value)}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Name for the reservation"
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="We send your confirmation here"
                  value={form.customerEmail}
                  onChange={(e) => update("customerEmail", e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone Number (optional)</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Optional, for same-day changes"
                  value={form.phoneNumber}
                  onChange={(e) => update("phoneNumber", e.target.value)}
                />
              </div>
            </div>

            <div className="checkbox-field">
              <input
                id="newsletter"
                type="checkbox"
                checked={form.newsletterSignup}
                onChange={(e) => update("newsletterSignup", e.target.checked)}
              />
              <label htmlFor="newsletter" style={{ textTransform: "none", letterSpacing: 0 }}>
                Add me to the Café Fausse newsletter
              </label>
            </div>

            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Checking availability..." : "Confirm Reservation"}
            </button>
          </form>
        </div>

        <div className="info-card">
          <p className="eyebrow">Good to Know</p>
          <h3>Reservation Details</h3>
          <p>
            We hold 30 tables each evening. Once a time slot is fully booked,
            you'll be asked to choose another time; there's no need to call.
          </p>
          <p>
            Hours: Monday–Saturday 5:00 PM – 11:00 PM, Sunday 5:00 PM – 9:00 PM.
          </p>
          <p>Questions? Call us at (202) 555-4567.</p>
        </div>
      </div>
    </div>
  );
}
