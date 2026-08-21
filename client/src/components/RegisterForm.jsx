import { Link } from "react-router-dom";
import { useState } from "react";

function RegisterForm({ onRegister, loading }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await onRegister(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">
        Join Campus Connect
      </p>
      <h2 className="mt-1 text-2xl font-black text-slate-900">
        Create Your Account
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Create a student account to discover and register for campus events.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Full Name
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>

        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="auth-submit-button w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-cyan-700 hover:text-cyan-800"
        >
          Login
        </Link>
      </p>
    </section>
  );
}

export default RegisterForm;
