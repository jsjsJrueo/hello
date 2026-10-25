// Shows ONE Pokémon. It gets everything through props and never calls the API.
function Card({ pokemon, onEdit, onDelete }) {
  const stats = [
    ["Health", pokemon.health],
    ["Attack", pokemon.attack],
    ["Defense", pokemon.defense],
    ["Speed", pokemon.speed],
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <div
        className="relative h-32 bg-gray-200 bg-cover bg-center"
        style={{ backgroundImage: `url("${pokemon.background}")` }}
      >
        <img
          src={pokemon.avatar}
          alt={pokemon.name}
          className="absolute -bottom-10 left-4 h-24 w-24 rounded-full border-4 border-white bg-white object-cover"
        />
      </div>

      <div className="px-4 pb-4 pt-12">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-lg font-bold">{pokemon.name}</h3>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold capitalize text-indigo-700">
            {pokemon.type}
          </span>
        </div>
        <p className="text-sm text-gray-500">Level {pokemon.level}</p>

        {pokemon.description && (
          <p className="mt-2 text-sm text-gray-600">{pokemon.description}</p>
        )}

        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded bg-gray-50 px-2 py-1">
              <dt className="text-xs text-gray-500">{label}</dt>
              <dd className="font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(pokemon)}
            className="flex-1 rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(pokemon.id)}
            className="flex-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
