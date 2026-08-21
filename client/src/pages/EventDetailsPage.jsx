import { Link, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import {
  canStudentRegister,
  formatEventDate,
  getAvailableSeats,
} from "../utils/eventHelpers";

function DetailItem({ label, value }) {
  return (
    <p className="detail-item rounded-lg px-3 py-2 text-sm">
      <span className="font-semibold">{label}:</span> {value}
    </p>
  );
}

function EventDetailsPage({ events, role, onRegister, onEdit, onDelete }) {
  const { eventId } = useParams();
  const event = events.find((item) => String(item.id) === String(eventId));
  const eventsPath = role === "admin" ? "/admin/events" : "/student";

  if (!event) {
    return (
      <section className="event-details rounded-2xl border p-5 shadow-sm">
        <h2 className="text-xl font-bold">Event Not Found</h2>
        <p className="details-muted mt-2">
          The event you are looking for does not exist.
        </p>
        <Link
          to={eventsPath}
          className="mt-4 inline-block rounded-lg bg-[#71dbcf] px-3 py-2 text-sm font-semibold text-[#07131f]"
        >
          Back to Events
        </Link>
      </section>
    );
  }

  const canRegister = canStudentRegister(event);

  return (
    <section className="event-details rounded-2xl border p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#71dbcf]">
            {event.type}
          </p>
          <h2 className="mt-1 text-2xl font-black">{event.name}</h2>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <p className="details-muted mt-4">{event.description}</p>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <DetailItem label="Resource Person" value={event.resourcePerson} />
        <DetailItem label="Event Date" value={formatEventDate(event.date)} />
        <DetailItem label="Venue" value={event.venue} />
        <DetailItem
          label="Maximum Participants"
          value={event.maxParticipants}
        />
        <DetailItem label="Available Seats" value={getAvailableSeats(event)} />
        <DetailItem label="Registration Status" value={event.status} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {role === "student" && (
          <button
            type="button"
            onClick={() => onRegister(event.id)}
            disabled={!canRegister}
            className="rounded-lg bg-[#71dbcf] px-4 py-2 text-sm font-semibold text-[#07131f] transition hover:bg-[#9ff0e6] disabled:cursor-not-allowed disabled:bg-[#52656b]"
          >
            Register
          </button>
        )}

        {role === "admin" && (
          <>
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(event.id)}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Delete
            </button>
          </>
        )}

        <Link
          to={eventsPath}
          className="details-back rounded-lg border px-4 py-2 text-sm font-semibold"
        >
          Back
        </Link>
      </div>
    </section>
  );
}

export default EventDetailsPage;
