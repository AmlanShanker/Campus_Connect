import { getAvailableSeats } from "../utils/eventHelpers";

function EventStats({ events, registrations }) {
  const registeredSeats = events.reduce(
    (total, event) => total + event.registeredCount,
    0,
  );
  const totalCapacity = events.reduce(
    (total, event) => total + event.maxParticipants,
    0,
  );
  const fillRate = totalCapacity
    ? Math.round((registeredSeats / totalCapacity) * 100)
    : 0;
  const availableSeats = events.reduce(
    (total, event) => total + getAvailableSeats(event),
    0,
  );

  const stats = [
    { label: "Total events", value: events.length, tone: "surface-panel" },
    {
      label: "Registrations",
      value: registrations.length,
      tone: "bg-[#0b5961]",
      emphasis: true,
    },
    {
      label: "Seats remaining",
      value: availableSeats,
      tone: "bg-[#77512b]",
      emphasis: true,
    },
    {
      label: "Capacity filled",
      value: `${fillRate}%`,
      tone: "bg-[#334c68]",
      emphasis: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.tone} ${stat.emphasis ? "stats-emphasis" : ""} rounded-xl border p-4 text-[#e6f4f1]`}
        >
          <p className="text-xs uppercase tracking-[0.16em]">{stat.label}</p>
          <p className="mt-2 text-3xl font-black">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default EventStats;
