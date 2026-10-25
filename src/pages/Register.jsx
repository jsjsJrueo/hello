import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerAPI } from "../api/users";

const FIELDS = [
  { name: "username", label: "Username", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "first_name", label: "First name", type: "text" },
  { name: "last_name", label: "Last name", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirm_password", label: "Confirm password", type: "password" },
];

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerAPI(form);
      navigate("/login", {
        state: { message: "Account created! You can log in now." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold">Create an account</h1>

        {error && (
          <p className="whitespace-pre-line rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {FIELDS.map(({ name, label, type }) => (
          <label key={name} className="block text-sm font-medium">
            {label}
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
