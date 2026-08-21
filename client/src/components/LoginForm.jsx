import { Link } from "react-router-dom";
import { useState } from "react";

function LoginForm({ onLogin, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await onLogin({ email, password });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
        Welcome Back
      </p>
      <h2 className="mt-1 text-2xl font-black text-slate-900">
        Login to Campus Connect
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Use your account to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
            placeholder="name@campus.edu"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
            placeholder="Enter password"
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
          {loading ? "Signing In..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        New here?{" "}
        <Link
          to="/register"
          className="font-semibold text-cyan-700 hover:text-cyan-800"
        >
          Create an account
        </Link>
      </p>
    </section>
  );
}

export default LoginForm;
