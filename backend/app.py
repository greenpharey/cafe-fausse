import random
import re
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import func

from config import Config
from models import Customer, NewsletterSignup, Reservation, db

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    with app.app_context():
        db.create_all()

    register_routes(app)
    return app


def register_routes(app):
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    # ------------------------------------------------------------------
    # Reservations
    # ------------------------------------------------------------------
    @app.route("/api/reservations", methods=["POST"])
    def create_reservation():
        data = request.get_json(silent=True) or {}

        name = (data.get("customer_name") or "").strip()
        email = (data.get("customer_email") or "").strip()
        phone = (data.get("phone_number") or "").strip() or None
        time_slot_raw = (data.get("time_slot") or "").strip()
        guests = data.get("number_of_guests", 1)
        newsletter = bool(data.get("newsletter_signup", False))

        # ---- validation ----
        errors = []
        if not name:
            errors.append("Name is required.")
        if not email or not EMAIL_RE.match(email):
            errors.append("A valid email address is required.")
        if not time_slot_raw:
            errors.append("A time slot is required.")
        try:
            guests = int(guests)
            if guests < 1 or guests > 20:
                errors.append("Number of guests must be between 1 and 20.")
        except (TypeError, ValueError):
            errors.append("Number of guests must be a number.")

        time_slot = None
        if time_slot_raw:
            try:
                time_slot = datetime.fromisoformat(time_slot_raw)
            except ValueError:
                errors.append("Time slot must be a valid date and time.")

        if errors:
            return jsonify({"success": False, "errors": errors}), 400
            
        for attempt in range(3):
          # ---- table availability check (re-read fresh each attempt) ----
            occupied_tables = {
                row.table_number
                for row in Reservation.query.filter_by(time_slot=time_slot).all()
            }
            available_tables = [
                t for t in range(1, app.config["TOTAL_TABLES"] + 1)
                if t not in occupied_tables
            ]

            if not available_tables:
                return (
                    jsonify(
                        {
                            "success": False,
                            "errors": [
                                "That time slot is fully booked. Please choose another time."
                            ],
                        }
                    ),
                    409,
                )

            assigned_table = random.choice(available_tables)

            # ---- persist customer (reuse if email already on file) ----
            customer = Customer.query.filter_by(customer_email=email).first()
            if customer is None:
                customer = Customer(
                    customer_name=name,
                    customer_email=email,
                    phone_number=phone,
                    newsletter_signup=newsletter,
                )
                db.session.add(customer)
            else:
                customer.customer_name = name
                customer.phone_number = phone or customer.phone_number
                customer.newsletter_signup = customer.newsletter_signup or newsletter

            db.session.flush()  # get customer.customer_id before commit

            if newsletter:
                existing_signup = NewsletterSignup.query.filter(
                    func.lower(NewsletterSignup.email) == email.lower()
                ).first()

                if existing_signup is None:
                    signup = NewsletterSignup(email=email)
                    db.session.add(signup)

            reservation = Reservation(
                customer_id=customer.customer_id,
                time_slot=time_slot,
                table_number=assigned_table,
                number_of_guests=guests,
            )
            db.session.add(reservation)

            try:
                db.session.commit()
                break  # success
            except IntegrityError:
                # Another request took this exact table at this exact slot
                # between our availability check and our commit. Roll back
                # and retry with a freshly-read table list.
                db.session.rollback()
                continue
        else:
            return (
                jsonify(
                    {
                        "success": False,
                        "errors": [
                            "That time slot is in high demand right now. Please try again."
                        ],
                    }
                ),
                503,
            )

        return (
            jsonify(
                {
                    "success": True,
                    "message": (
                        f"Reservation confirmed for {name} on "
                        f"{time_slot.strftime('%B %d, %Y at %I:%M %p')}. "
                        f"You have been assigned Table {assigned_table}."
                    ),
                    "reservation": reservation.to_dict(),
                }
            ),
            201,
        )

    @app.route("/api/reservations", methods=["GET"])
    def list_reservations():
        """Admin/debug helper: list all reservations, most recent first."""
        reservations = Reservation.query.order_by(Reservation.time_slot.desc()).all()
        return jsonify([r.to_dict() for r in reservations])

    # ------------------------------------------------------------------
    # Newsletter signup
    # ------------------------------------------------------------------
    @app.route("/api/newsletter", methods=["POST"])
    def newsletter_signup():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip()

        if not email or not EMAIL_RE.match(email):
            return (
                jsonify({"success": False, "errors": ["A valid email address is required."]}),
                400,
            )

        existing = NewsletterSignup.query.filter(
            func.lower(NewsletterSignup.email) == email.lower()
        ).first()
        if existing:
            return jsonify(
                {"success": True, "message": "You're already subscribed. Thank you!"}
            )

        signup = NewsletterSignup(email=email)
        db.session.add(signup)

        # If this email already belongs to a customer, flag their record too.
        customer = Customer.query.filter_by(customer_email=email).first()
        if customer:
            customer.newsletter_signup = True

        db.session.commit()
        return (
            jsonify({"success": True, "message": "Thanks for subscribing to our newsletter!"}),
            201,
        )

    @app.route("/api/newsletter", methods=["GET"])
    def list_newsletter_signups():
        """Admin/debug helper."""
        signups = NewsletterSignup.query.order_by(NewsletterSignup.created_at.desc()).all()
        return jsonify([s.to_dict() for s in signups])


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
