import { useMemo } from "react";
import EventCard from "./EventCard";

function RecommendedEvents({ events, registrations, onRegister }) {
  const recommendations = useMemo(() => {
    const registeredEventNames = new Set(
      registrations.map((registration) => registration.eventName),
    );
    const preferredTypes = new Set(
      registrations.map((registration) => registration.eventType),
    );
    const upcomingEvents = events.filter(
      (event) =>
        !registeredEventNames.has(event.name) &&
        new Date(event.date).getTime() >= Date.now(),
    );
    const matchingEvents = upcomingEvents.filter((event) =>
      preferredTypes.has(event.type),
    );

    return (matchingEvents.length ? matchingEvents : upcomingEvents).slice(
      0,
      3,
    );
  }, [events, registrations]);

  if (!recommendations.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f6b252]">
          Curated for you
        </p>
        <h3 className="display-title text-2xl font-black text-[#e6f4f1]">
          More in your orbit
        </h3>
        <p className="mt-1 text-sm text-[#9ab8b7]">
          Based on the event types you have explored.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {recommendations.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            role="student"
            onRegister={onRegister}
          />
        ))}
      </div>
    </div>
  );
}

export default RecommendedEvents;
