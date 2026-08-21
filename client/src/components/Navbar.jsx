import { NavLink } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const isAdmin = user?.role === "admin";

  return (
    <header className="site-nav sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#71dbcf]">
            Campus Connect
          </p>
          <h1 className="text-lg font-bold text-[#e6f4f1] sm:text-xl">
            Event and Workshop Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-full border border-[#71dbcf]/20 bg-[#102b3a] px-3 py-1.5 text-sm font-semibold text-[#b8d4d0] sm:block">
            {user?.name} ({user?.role})
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-[#ed7651] px-3 py-1.5 text-sm font-semibold text-[#07131f] transition hover:bg-[#f58c68]"
          >
            Logout
          </button>
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-6xl gap-2 px-4 pb-3 sm:px-6 lg:px-8">
        <NavLink
          to={isAdmin ? "/admin" : "/student"}
          className={({ isActive }) =>
            `rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              isActive
                ? "bg-[#71dbcf] text-[#07131f]"
                : "text-[#b8d4d0] hover:bg-[#163747]"
            }`
          }
        >
          {isAdmin ? "Admin Dashboard" : "Events"}
        </NavLink>

        <NavLink
          to={isAdmin ? "/admin/registrations" : "/student/registrations"}
          className={({ isActive }) =>
            `rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              isActive
                ? "bg-[#71dbcf] text-[#07131f]"
                : "text-[#b8d4d0] hover:bg-[#163747]"
            }`
          }
        >
          Registrations
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#71dbcf] text-[#07131f]"
                  : "text-[#b8d4d0] hover:bg-[#163747]"
              }`
            }
          >
            Manage Events
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
