import { API_URL } from "./config";
import { buildError } from "./errors";

const USERS_URL = `${API_URL}users/`;

// POST /api/users/ (public: no token needed)
export async function registerAPI(userData) {
  const response = await fetch(USERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw buildError(response, data, "Failed to register");
  }

  return data;
}
