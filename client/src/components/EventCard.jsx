import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import {
  canStudentRegister,
  formatEventDate,
  getAvailableSeats,
} from "../utils/eventHelpers";

function InfoRow({ label, value }) {
  return (
    <p className="text-sm text-slate-600">
      <span className="font-semibold text-slate-800">{label}:</span> {value}
    </p>
  );
}

function formatCountdown(dateString, now) {
  const eventTime = new Date(dateString).getTime();
  const remaining = eventTime - now;

  if (!Number.isFinite(eventTime) || remaining <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
}

function EventCard({ event, role, onRegister, onEdit, onDelete }) {
  const [now, setNow] = useState(() => Date.now());
  const seats = getAvailableSeats(event);
  const capacityPercent = Math.min(
    Math.round((event.registeredCount / event.maxParticipants) * 100),
    100,
  );
  const seatTone =
    seats === 0
      ? "bg-rose-500"
      : capacityPercent >= 80
        ? "bg-amber-400"
        : "bg-[#71dbcf]";
  const studentCanRegister = canStudentRegister(event);
  const countdown = formatCountdown(event.date, now);
  const detailsPath =
    role === "admin"
      ? `/admin/events/${event.id}`
      : `/student/events/${event.id}`;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <article className="event-card group flex h-full flex-col rounded-2xl border p-5 transition hover:-translate-y-1">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#71dbcf]">
            {event.type}
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#e6f4f1]">
            {event.name}
          </h3>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="relative z-10 space-y-1.5">
        <InfoRow label="Resource Person" value={event.resourcePerson} />
        <InfoRow label="Event Date" value={formatEventDate(event.date)} />
        {countdown && (
          <p className="mt-3 rounded-lg border border-[#71dbcf]/20 bg-[#113c48] px-3 py-2 text-sm font-bold text-[#9ff0e6]">
            Starts in {countdown}
          </p>
        )}
        <InfoRow label="Venue" value={event.venue} />
        <InfoRow label="Max Participants" value={event.maxParticipants} />
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-[#c6dedb]">
              Seat availability
            </span>
            <span className="font-bold text-[#e6f4f1]">{seats} available</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-[#102b3a]"
            aria-label={`${capacityPercent}% of seats registered`}
          >
            <div
              className={`h-full rounded-full transition-all ${seatTone}`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-[#9ab8b7]">
            {capacityPercent}% registered
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={detailsPath}
          className="rounded-lg border border-[#71dbcf]/30 px-3 py-2 text-sm font-semibold text-[#d0e6e2] transition hover:border-[#71dbcf] hover:bg-[#163747]"
        >
          View Details
        </Link>

        {role === "student" && (
          <button
            type="button"
            disabled={!studentCanRegister}
            onClick={() => onRegister(event.id)}
            className="rounded-lg bg-[#71dbcf] px-3 py-2 text-sm font-semibold text-[#07131f] transition hover:bg-[#9ff0e6] disabled:cursor-not-allowed disabled:bg-[#52656b]"
          >
            Register
          </button>
        )}

        {role === "admin" && (
          <>
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(event.id)}
              className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default EventCard;
