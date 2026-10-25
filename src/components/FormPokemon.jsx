import { useState } from "react";

const TYPES = [
  "water",
  "fire",
  "wind",
  "light",
  "darkness",
  "lightning",
  "rock",
  "nature",
];

// The minimums match the Django model validators.
const STATS = [
  { name: "level", min: 1 },
  { name: "health", min: 100 },
  { name: "attack", min: 10 },
  { name: "defense", min: 5 },
  { name: "speed", min: 15 },
];

const EMPTY_VALUES = {
  name: "",
  description: "",
  type: "water",
  level: 1,
  health: 100,
  attack: 10,
  defense: 5,
  speed: 15,
};

function valuesFrom(pokemon) {
  return {
    name: pokemon.name,
    description: pokemon.description ?? "",
    type: pokemon.type,
    level: pokemon.level,
    health: pokemon.health,
    attack: pokemon.attack,
    defense: pokemon.defense,
    speed: pokemon.speed,
  };
}

// Used for both creating (pokemon is null) and editing (pokemon is given).
// The parent gives it a new `key` to reset it.
function FormPokemon({ pokemon, error, onSubmit, onCancel }) {
  const isEditing = Boolean(pokemon);
  const [values, setValues] = useState(
    isEditing ? valuesFrom(pokemon) : EMPTY_VALUES
  );
  const [avatar, setAvatar] = useState(null);
  const [background, setBackground] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Images need multipart form data instead of JSON.
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (avatar) formData.append("avatar", avatar);
    if (background) formData.append("background", background);

    setSaving(true);
    await onSubmit(formData);
    setSaving(false);
  }

  const inputClass =
    "mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6 shadow"
    >
      <h2 className="text-xl font-bold">
        {isEditing ? `Edit ${pokemon.name}` : "Add a Pokémon"}
      </h2>

      {error && (
        <p className="whitespace-pre-line rounded bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Name
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            maxLength={50}
            required
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium">
          Type
          <select
            name="type"
            value={values.type}
            onChange={handleChange}
            className={`${inputClass} capitalize`}
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium">
        Description
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={2}
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {STATS.map(({ name, min }) => (
          <label key={name} className="block text-sm font-medium capitalize">
            {name}
            <input
              type="number"
              name={name}
              min={min}
              value={values[name]}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Avatar
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0] ?? null)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium">
          Background
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBackground(e.target.files[0] ?? null)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Save changes" : "Add Pokémon"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default FormPokemon;
