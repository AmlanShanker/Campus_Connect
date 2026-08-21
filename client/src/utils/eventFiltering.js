import { getAvailableSeats } from "./eventHelpers";

export function filterAndSortEvents(events, controls) {
  const searchTerm = controls.search.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !searchTerm ||
      [event.name, event.resourcePerson, event.venue].some((value) =>
        value.toLowerCase().includes(searchTerm),
      );
    const matchesType = !controls.type || event.type === controls.type;
    const matchesStatus = !controls.status || event.status === controls.status;
    const matchesDate = !controls.date || event.date === controls.date;

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  return [...filteredEvents].sort((firstEvent, secondEvent) => {
    if (controls.sort === "name") {
      return firstEvent.name.localeCompare(secondEvent.name);
    }

    if (controls.sort === "seats") {
      return (
        getAvailableSeats(secondEvent) - getAvailableSeats(firstEvent) ||
        firstEvent.name.localeCompare(secondEvent.name)
      );
    }

    return (
      new Date(firstEvent.date).getTime() -
        new Date(secondEvent.date).getTime() ||
      firstEvent.name.localeCompare(secondEvent.name)
    );
  });
}
