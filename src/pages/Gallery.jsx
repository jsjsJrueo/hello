import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { clearTokens } from "../api/auth";
import {
  PokemonCreateAPI,
  PokemonDeleteAPI,
  PokemonListAPI,
  PokemonPatchAPI,
} from "../api/pokemons";
import FormPokemon from "../components/FormPokemon";
import GalleryPokemon from "../components/GalleryPokemon";

// This page owns the data. The components only get props.
function Gallery() {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [editing, setEditing] = useState(null); // the Pokémon being edited
  const [formKey, setFormKey] = useState(0); // changing it resets the form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // READ: load the Pokémon once when the page mounts.
  useEffect(() => {
    async function loadPokemons() {
      try {
        const data = await PokemonListAPI();
        setPokemons(data);
      } catch (err) {
        if (err.status === 401) {
          // Missing or expired token: back to Login.
          clearTokens();
          navigate("/login");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    loadPokemons();
  }, [navigate]);

  function logout() {
    clearTokens();
    navigate("/login");
  }

  function handleFailure(err, setMessage) {
    if (err.status === 401) {
      logout();
    } else {
      setMessage(err.message);
    }
  }

  function resetForm() {
    setEditing(null);
    setFormError("");
    setFormKey((key) => key + 1);
  }

  // CREATE or UPDATE, depending on whether a Pokémon is being edited.
  async function handleSave(formData) {
    setFormError("");
    try {
      if (editing) {
        const updated = await PokemonPatchAPI(editing.id, formData);
        setPokemons((current) =>
          current.map((p) => (p.id === updated.id ? updated : p))
        );
      } else {
        const created = await PokemonCreateAPI(formData);
        setPokemons((current) => [...current, created]);
      }
      resetForm();
    } catch (err) {
      handleFailure(err, setFormError);
    }
  }

  function handleEdit(pokemon) {
    setEditing(pokemon);
    setFormError("");
    setFormKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // DELETE: call the API, then remove it from state with a new array.
  async function handleDelete(id) {
    if (!window.confirm("Delete this Pokémon?")) return;
    setError("");
    try {
      await PokemonDeleteAPI(id);
      setPokemons((current) => current.filter((p) => p.id !== id));
      if (editing && editing.id === id) {
        resetForm();
      }
    } catch (err) {
      handleFailure(err, setError);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">Pokédex</h1>
          <button
            type="button"
            onClick={logout}
            className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-300"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <FormPokemon
          key={formKey}
          pokemon={editing}
          error={formError}
          onSubmit={handleSave}
          onCancel={resetForm}
        />

        {error && (
          <p className="whitespace-pre-line rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading Pokémon...</p>
        ) : (
          <GalleryPokemon
            pokemons={pokemons}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default Gallery;
