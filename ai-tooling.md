# AI Tooling Summary

**Tool used:** Claude (Anthropic), via the Claude chat interface with code
execution.

## How it was used

- Loaded the project brief and SRS PDFs directly, then used them as the
  spec for the whole build: page list, table schema (Customers /
  Reservations), reservation logic (30 tables, random assignment, conflict
  handling), and menu content all came straight from the SRS rather than
  being invented.
- Generated the Flask backend (`app.py`, `models.py`, `config.py`) —
  routes, SQLAlchemy models, and input validation — in one pass, then
  iterated based on actual test failures.
- Generated the full React front end: routing shell, five pages, shared
  Navbar/Footer/Lightbox components, and the CSS design system (tokens,
  Grid/Flexbox layout, responsive breakpoints).
- Used AI-assisted design judgment for the visual identity (typography
  pairing, color palette, the "printed menu" motif on the Menu page)
  rather than defaulting to a generic template look.

## What worked well

- Generating the backend and frontend together in one coherent pass kept
  the API contract (field names, response shapes) consistent on both
  sides without extra glue code.
- Having the AI run the Flask app against its test client (in-memory
  SQLite) caught two real bugs before ever touching the browser: a missing
  `db.session.flush()` before reading the new customer's ID, and a
  duplicate-email edge case on the newsletter endpoint.
- `vite build` was used to confirm the whole React app compiles cleanly
  (no broken imports/JSX) before treating it as done.

## What didn't / limitations

- The AI tool doesn't have a real PostgreSQL instance or a browser in this
  environment, so the backend was validated with SQLite as a stand-in and
  the frontend was verified by production build rather than a live
  click-through. Both should be smoke-tested locally against real
  Postgres before recording the demo.
- Gallery and about-page photography are stock placeholders (Unsplash);
  swap in the restaurant's own royalty-free or AI-generated images before
  final submission, per the assignment note.
- No automated test suite was written, consistent with the assignment's
  note that significant testing is out of scope for this project.
