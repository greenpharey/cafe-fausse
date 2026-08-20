const API_BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data.errors && data.errors.join(" ")) || data.message || "Request failed.";
    const err = new Error(message);
    err.data = data;
    throw err;
  }
  return data;
}

export function createReservation(payload) {
  return request("/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signUpForNewsletter(email) {
  return request("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
