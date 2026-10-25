import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { loginAPI, saveTokens } from "../api/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Register sends us here with a success message.
  const message = location.state?.message;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginAPI(form);
      saveTokens(data);
      navigate("/gallery");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold">Pokédex Login</h1>

        {message && (
          <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        )}
        {error && (
          <p className="whitespace-pre-line rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium">
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm text-gray-600">
          No account yet?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
