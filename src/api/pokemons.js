import { API_URL } from "./config";
import { getToken } from "./auth";
import { buildError } from "./errors";

const POKEMON_URL = `${API_URL}pokemons/`;

// Every Pokémon endpoint needs the access token.
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// GET /api/pokemons/
export async function PokemonListAPI() {
  const response = await fetch(POKEMON_URL, {
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw buildError(response, data, "Failed to fetch Pokémon");
  }

  return data;
}

// POST /api/pokemons/ (formData because of the image files)
// Do not set Content-Type here: the browser sets it, with the boundary.
export async function PokemonCreateAPI(formData) {
  const response = await fetch(POKEMON_URL, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw buildError(response, data, "Failed to create Pokémon");
  }

  return data;
}

// PATCH /api/pokemons/<id>/ (partial update)
export async function PokemonPatchAPI(id, formData) {
  const response = await fetch(`${POKEMON_URL}${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw buildError(response, data, "Failed to update Pokémon");
  }

  return data;
}

// DELETE /api/pokemons/<id>/
export async function PokemonDeleteAPI(id) {
  const response = await fetch(`${POKEMON_URL}${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  // 204 No Content has an empty body, so only read JSON when it failed.
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw buildError(response, data, "Failed to delete Pokémon");
  }
}
