import { useEffect, useMemo, useState } from "react";
import EventControls from "../components/EventControls";
import EventCard from "../components/EventCard";
import RecommendedEvents from "../components/RecommendedEvents";
import { filterAndSortEvents } from "../utils/eventFiltering";

const initialControls = {
  search: "",
  type: "",
  status: "",
  date: "",
  sort: "upcoming",
};

function EventsPage({
  events,
  role,
  registrations = [],
  onRegister,
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

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f6b252]">
            Live campus calendar
          </p>
          <h2 className="display-title mt-2 text-4xl font-black text-[#e6f4f1] sm:text-5xl">
            Find your next spark.
          </h2>
          <div className="hero-rule" />
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#9ab8b7]">
            Technical builds, academic conversations, and the people who make
            campus feel alive. Your next room, idea, or collaborator is here.
          </p>
        </div>
        <div className="rounded-2xl border border-[#f6b252]/30 bg-[#1a2933] px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-[#9ab8b7]">
            On the radar
          </p>
          <p className="mt-1 text-3xl font-black text-[#f6b252]">
            {events.length.toString().padStart(2, "0")}
          </p>
          <p className="text-xs text-[#b8d4d0]">campus events</p>
        </div>
      </div>

      <EventControls
        events={events}
        controls={controls}
        onChange={setControls}
      />

      {role === "student" && (
        <RecommendedEvents
          events={events}
          registrations={registrations}
          onRegister={onRegister}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            role={role}
            onRegister={onRegister}
            onEdit={onEdit}
            onDelete={onDelete}
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

export default EventsPage;
