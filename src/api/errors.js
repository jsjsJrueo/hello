// Turns a Django REST Framework error body into a readable message.
// 401/404 bodies look like { detail: "..." }.
// 400 bodies look like { field: ["message", ...] }.
export function getErrorMessage(data, fallback) {
  if (!data || typeof data !== "object") {
    return fallback;
  }
  if (data.detail) {
    return data.detail;
  }
  const messages = Object.entries(data).map(
    ([field, problems]) => `${field}: ${[].concat(problems).join(" ")}`
  );
  return messages.length > 0 ? messages.join("\n") : fallback;
}

// Builds an Error that also remembers the HTTP status (for example 401),
// so the pages can decide what to do with it.
export function buildError(response, data, fallback) {
  const error = new Error(getErrorMessage(data, fallback));
  error.status = response.status;
  return error;
}
