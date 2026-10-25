import { API_URL } from "./config";
import { buildError } from "./errors";

// POST /api/token/ -> { access, refresh }
export async function loginAPI(credentials) {
  // 1. send the request
  const response = await fetch(`${API_URL}token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  // 2. convert the JSON response to JavaScript
  const data = await response.json();

  // 3. check the response
  if (!response.ok) {
    throw buildError(response, data, "Login failed");
  }

  // 4. return the data
  return data;
}

// Login info lives in localStorage so it survives a page refresh.
export function saveTokens(data) {
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
}

export function getToken() {
  return localStorage.getItem("access");
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
