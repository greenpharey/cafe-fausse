# Café Fausse Website

A full-stack web application for Café Fausse, a fine-dining restaurant in Washington, DC. Built with React (JSX) on the front end, Flask on the back end, and PostgreSQL for persistent storage, per the project SRS.

## What's Included

* **Five pages:** Home, Menu, Reservations, About Us, and Gallery using React Router
* **Reservation system:** Date/time, party size, name, email, and optional phone form that checks table availability against 30 tables, assigns a random available table, and returns a success or fully booked message
* **Newsletter signup:** Available as a standalone form in the footer and as an option on the reservation form. Both paths are validated and stored in the database
* **Gallery:** Image gallery with lightbox viewer, awards, and customer reviews
* **Responsive design:** Consistent styling built with CSS Grid and Flexbox for desktop, tablet, and mobile layouts

## Design

The visual direction is inspired by a classic fine-dining printed menu. Headlines use Cormorant Garamond, an elegant serif typeface, while body text uses Karla for readability.

The Menu page uses traditional section dividers such as `— Starters —` and dotted price leaders rather than a generic card-based layout. The color palette combines deep Bordeaux wine, antique gold, warm parchment cream, and an ink-black footer to create a refined but welcoming atmosphere.

## Project Structure

```text
cafe-fausse/
├── backend/                    # Flask API + PostgreSQL models
│   ├── app.py                  # Reservation and newsletter API routes
│   ├── models.py               # Customer, Reservation, NewsletterSignup
│   ├── config.py               # Flask/database configuration
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Example environment configuration
│
├── frontend/                   # React + Vite application
│   ├── public/                 # Static images and assets
│   ├── src/
│   │   ├── pages/              # Home, Menu, Reservations, About, Gallery
│   │   ├── components/         # Navbar, Footer, Lightbox
│   │   ├── data/               # Static menu/gallery/review content
│   │   ├── api.js              # Fetch wrapper for Flask API
│   │   └── App.jsx
│   └── vite.config.js          # Proxies /api requests to Flask in development
│
├── README.md
├── ai-tooling.md
└── staging.md
```

## Data Model

### customers

| Column            | Type                 |
| ----------------- | -------------------- |
| customer_id       | Primary key, integer |
| customer_name     | String               |
| customer_email    | String               |
| phone_number      | String, nullable     |
| newsletter_signup | Boolean              |

### reservations

| Column           | Type                    |
| ---------------- | ----------------------- |
| reservation_id   | Primary key, integer    |
| customer_id      | Foreign key → customers |
| time_slot        | Date/time               |
| table_number     | Integer (1–30)          |
| number_of_guests | Integer                 |

### newsletter_signups

This additional table stores newsletter subscriptions submitted through the standalone footer form.

| Column     | Description              |
| ---------- | ------------------------ |
| id         | Primary key              |
| email      | Subscriber email address |
| created_at | Signup date/time         |

Reservation logic is handled by `backend/app.py`. The application validates the submitted information, determines which of the 30 tables are already booked for the requested time slot, and randomly assigns an available table.

The customer record and reservation are then stored in PostgreSQL. If all 30 tables are occupied for the selected time slot, the API returns an error asking the customer to choose another time.

# Running the Application Locally

## Prerequisites

Install the following before running the project:

* Git
* Python 3
* PostgreSQL
* Node.js and npm

On Windows, Git Bash can be used for Git commands. PowerShell may block some script files depending on the computer's execution policy; alternatives are provided below where applicable.

## 1. Clone the Repository

```bash
git clone https://github.com/greenpharey/cafe-fausse.git
cd cafe-fausse
```

## 2. Configure PostgreSQL

Make sure PostgreSQL is installed and running.

Open **SQL Shell (psql)**.

Press Enter to accept the default Server, Database, Port, and Username values when appropriate, then enter the PostgreSQL administrator password.

At the PostgreSQL prompt, create the Café Fausse database and application user:

```sql
CREATE DATABASE cafe_fausse;

DROP USER IF EXISTS cafe_fausse_user;

CREATE USER cafe_fausse_user
WITH PASSWORD 'cafe_fausse_pass';

GRANT ALL PRIVILEGES
ON DATABASE cafe_fausse
TO cafe_fausse_user;
```

Connect to the new database:

```sql
\c cafe_fausse
```

Grant the application user permission to work with the public schema:

```sql
GRANT ALL ON SCHEMA public TO cafe_fausse_user;

GRANT ALL PRIVILEGES
ON ALL TABLES IN SCHEMA public
TO cafe_fausse_user;

ALTER DEFAULT PRIVILEGES
IN SCHEMA public
GRANT ALL ON TABLES
TO cafe_fausse_user;
```

These schema permissions are especially important with newer PostgreSQL versions.

## 3. Configure the Flask Backend

Open a terminal from the project root and navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

### macOS/Linux

Activate it with:

```bash
source venv/bin/activate
```

### Windows Command Prompt

```cmd
venv\Scripts\activate
```

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell prevents activation because script execution is disabled, activation can be skipped. Use the Python executable inside the virtual environment directly when installing dependencies and starting the application:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Install the backend dependencies if the environment was activated normally:

```bash
pip install -r requirements.txt
```

## 4. Configure Environment Variables

The repository includes `.env.example` but does not commit the actual `.env` file.

Create a local copy.

### Git Bash/macOS/Linux

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Verify that the PostgreSQL connection uses the `pg8000` driver:

```text
DATABASE_URL=postgresql+pg8000://cafe_fausse_user:cafe_fausse_pass@localhost:5432/cafe_fausse
```

If different PostgreSQL credentials were selected during setup, update the username, password, host, port, or database name accordingly.

The `.env` file is intentionally excluded from Git through `.gitignore`.

## 5. Start the Flask Backend

If the virtual environment is activated:

```bash
python app.py
```

If PowerShell prevented virtual-environment activation, run:

```powershell
.\venv\Scripts\python.exe app.py
```

The Flask development server should start at:

```text
http://127.0.0.1:5000
```

The required database tables are created automatically when the application starts.

The backend terminal must remain running while using the website.

A quick API health check is available at:

```text
http://127.0.0.1:5000/api/health
```

A successful response indicates that the Flask API is running.

## 6. Configure the React Frontend

Open a **second terminal** and navigate to the frontend directory:

```bash
cd frontend
```

Install the Node dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

If Windows PowerShell reports that `npm.ps1` cannot be executed because running scripts is disabled, use:

```powershell
npm.cmd run dev
```

Vite should display an address similar to:

```text
http://localhost:5173/
```

Open that address in a browser.

The frontend proxies `/api` requests to the Flask backend on port 5000 through `vite.config.js`.

## Running Both Servers

Both development servers must remain running while using Café Fausse.

```text
Terminal 1
Flask Backend
http://127.0.0.1:5000

Terminal 2
React/Vite Frontend
http://localhost:5173
```

The website itself should be accessed through the **frontend URL**:

```text
http://localhost:5173
```

# Verifying the Database

Reservations and newsletter subscriptions can be verified directly in PostgreSQL.

First, submit a test reservation through the Café Fausse website.

Then open SQL Shell and connect to the database:

```sql
\c cafe_fausse
```

Check the customer records:

```sql
SELECT * FROM customers
ORDER BY customer_id DESC;
```

Check reservations:

```sql
SELECT * FROM reservations
ORDER BY reservation_id DESC;
```

Submit a newsletter subscription through the website and check:

```sql
SELECT * FROM newsletter_signups
ORDER BY id DESC;
```

New records should appear after successful submissions.

This provides direct verification that the React interface, Flask API, and PostgreSQL database are communicating successfully.

# Testing Notes

Significant automated testing was outside the scope of the assignment. During development, the application is manually tested by using the React interface and verifying the resulting behavior and database records.

Testing includes:

* Navigation between all five pages
* Desktop and mobile layouts
* Reservation form validation
* Successful reservation creation
* Reservation records stored in PostgreSQL
* Customer records stored in PostgreSQL
* Newsletter email validation
* Newsletter subscriptions stored in PostgreSQL
* Gallery lightbox functionality
* Flask API health response
* User-friendly success and error messages

Before submission, the application should also be reviewed in multiple modern browsers and at desktop, tablet, and mobile viewport sizes.

# AI-Assisted Development

AI-assisted development tools were used during the development process. A summary of the tools used, how they contributed to the project, and the development experience is available in:

```text
ai-tooling.md
```

# Deployment

The application is currently configured to run locally.

See `staging.md` for staging/deployment information.
