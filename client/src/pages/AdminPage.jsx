import { useEffect, useMemo, useState } from "react";
import EventControls from "../components/EventControls";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";
import EventStats from "../components/EventStats";
import { filterAndSortEvents } from "../utils/eventFiltering";

const initialControls = {
  search: "",
  type: "",
  status: "",
  date: "",
  sort: "upcoming",
};

function AdminPage({
  role,
  events,
  selectedEvent,
  registrations,
  onSubmitEvent,
  onCancelEdit,
  onEdit,
  onDelete,
}) {
  const [controls, setControls] = useState(initialControls);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const visibleEvents = useMemo(
    () => filterAndSortEvents(events, controls),
    [events, controls],
  );
  const pageCount = Math.max(Math.ceil(visibleEvents.length / pageSize), 1);
  const paginatedEvents = visibleEvents.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    setPage(1);
  }, [controls]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  if (role !== "admin") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Admin Access Required
        </h2>
        <p className="mt-2 text-slate-600">
          Switch role to Admin to manage event lifecycle and registrations.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f6b252]">
          Admin Interface
        </p>
        <h2 className="display-title text-3xl font-black text-[#e6f4f1]">
          Manage Events and Lifecycle
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#9ab8b7]">
          Create events, update lifecycle states, monitor enrollment, and
          maintain seat availability.
        </p>
      </div>

      <EventForm
        selectedEvent={selectedEvent}
        onSubmit={onSubmitEvent}
        onCancel={onCancelEdit}
      />

      <EventStats events={events} registrations={registrations} />

      <EventControls
        events={events}
        controls={controls}
        onChange={setControls}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            role={role}
            onEdit={onEdit}
            onDelete={onDelete}
            onRegister={() => {}}
          />
        ))}
      </div>
      {visibleEvents.length > 0 && (
        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-[#9ab8b7]">
          <span>
            Showing {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, visibleEvents.length)} of{" "}
            {visibleEvents.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-[#71dbcf]/30 px-3 py-2 font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-[#71dbcf]/30 px-3 py-2 font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {visibleEvents.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
          No events match the selected search and filters.
        </p>
      )}
    </section>
  );
}

export default AdminPage;
