import RegistrationCard from "../components/RegistrationCard";

function RegistrationsPage({ registrations, role }) {
  const title =
    role === "admin" ? "Campus Registration Monitor" : "My Registrations";
  const subtitle =
    role === "admin"
      ? "Track student participation across technical and academic events."
      : "Review your current event enrollments and registration status.";

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Registrations
        </p>
        <h2 className="text-2xl font-black text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-slate-600">
          No registrations yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {registrations.map((registration) => (
            <RegistrationCard
              key={registration.id}
              registration={registration}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default RegistrationsPage;
