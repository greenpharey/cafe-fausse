# Café Fausse Website

A full-stack web application for Café Fausse, a fine-dining restaurant in
Washington, DC. Built with React (JSX) on the front end, Flask on the back
end, and PostgreSQL for persistent storage, per the project SRS.

## What's included

- **Five pages**: Home, Menu, Reservations, About Us, Gallery (React Router)
- **Reservation system**: date/time/party-size/name/email/phone form that
  checks table availability against 30 tables, assigns a random open table,
  and returns a success or "fully booked" message
- **Newsletter signup**: available both as a standalone form in the footer
  (on every page) and as a checkbox on the reservation form; both paths are
  validated and stored in the database
- **Gallery**: lightbox viewer, awards, and customer reviews
- **Responsive, consistent design** built with CSS Grid and Flexbox

## Design

The visual direction leans into what Café Fausse actually is: a printed
menu. Headlines use Cormorant Garamond (an elegant, slightly formal serif),
body text uses Karla, and section dividers on the Menu page read like a
real printed menu (`— Starters —`) with dotted price leaders, rather than a
generic template layout. The palette is a deep Bordeaux wine, antique gold,
and warm parchment cream, with an ink-black footer.

## Project structure

```
cafe-fausse/
├── backend/                 # Flask API + PostgreSQL models
│   ├── app.py                # Routes: /api/reservations, /api/newsletter
│   ├── models.py              # Customer, Reservation, NewsletterSignup
│   ├── config.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/                 # React (Vite) app
    ├── src/
    │   ├── pages/             # Home, Menu, Reservations, About, Gallery
    │   ├── components/        # Navbar, Footer, Lightbox
    │   ├── data/               # Static menu/gallery/review content
    │   ├── api.js               # fetch() wrapper for the Flask API
    │   └── App.jsx
    └── vite.config.js          # proxies /api to the Flask server in dev
```

## Data model

**customers**
| column | type |
|---|---|
| customer_id | PK, integer |
| customer_name | string |
| customer_email | string |
| phone_number | string, nullable |
| newsletter_signup | boolean |

**reservations**
| column | type |
|---|---|
| reservation_id | PK, integer |
| customer_id | FK → customers |
| time_slot | datetime |
| table_number | integer (1–30) |
| number_of_guests | integer |

**newsletter_signups** (extra table for footer signups not tied to a
reservation): id, email, created_at.

Reservation logic lives in `backend/app.py::create_reservation`: it
validates input, looks up which of the 30 tables are already booked for
the requested `time_slot`, and if any remain, assigns one at random,
upserts the customer record, and inserts the reservation. If none remain
it returns HTTP 409 with a "choose another time" message.

## Running it locally

### 1. PostgreSQL

Create a database and user (adjust names/password as you like):

```bash
createdb cafe_fausse
psql -c "CREATE USER cafe_fausse_user WITH PASSWORD 'cafe_fausse_pass';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE cafe_fausse TO cafe_fausse_user;"
```

### 2. Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # edit DATABASE_URL if needed
export $(cat .env | xargs)       # Windows: set vars manually, or use python-dotenv
python app.py
```

The API runs at `http://localhost:5000`. Tables are created automatically
on first run (`db.create_all()`).

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api/*` requests to
the Flask server on port 5000 (see `vite.config.js`).

### 4. Verifying the reservation → database flow

With both servers running:

```bash
psql cafe_fausse -c "SELECT * FROM reservations;"
psql cafe_fausse -c "SELECT * FROM customers;"
psql cafe_fausse -c "SELECT * FROM newsletter_signups;"
```

Submit a reservation or newsletter signup in the browser, then re-run the
query above to see the new row — this is the "show the effect on the
database itself" step called for in the project's presentation
requirements.

## Testing notes

Automated end-to-end testing (Cypress, pytest, etc.) was out of scope per
the assignment instructions ("you are not expected to have carried out
significant testing"). The reservation and newsletter endpoints were
smoke-tested directly against Flask's test client during development
(valid booking, duplicate-slot conflict, invalid email) to confirm the
core logic behaves correctly before wiring up the UI.
