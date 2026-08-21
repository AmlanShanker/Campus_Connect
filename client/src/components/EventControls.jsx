function EventControls({ events, controls, onChange }) {
  const eventTypes = [...new Set(events.map((event) => event.type))].sort();
  const statuses = [...new Set(events.map((event) => event.status))].sort();

  function updateControl(name, value) {
    onChange((previous) => ({ ...previous, [name]: value }));
  }

  const selectClassName =
    "rounded-lg border border-[#71dbcf]/25 bg-[#0b202d] px-3 py-2 text-sm text-[#e6f4f1] outline-none ring-[#71dbcf] focus:ring";

  return (
    <div className="control-panel mb-5 rounded-2xl border p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-semibold text-[#c6dedb] xl:col-span-2">
          Search events
          <input
            type="search"
            value={controls.search}
            onChange={(event) => updateControl("search", event.target.value)}
            placeholder="Name, resource person, or venue"
            className={`${selectClassName} mt-1 w-full`}
          />
        </label>

        <label className="text-sm font-semibold text-[#c6dedb]">
          Event type
          <select
            value={controls.type}
            onChange={(event) => updateControl("type", event.target.value)}
            className={`${selectClassName} mt-1 w-full`}
          >
            <option value="">All types</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-[#c6dedb]">
          Registration status
          <select
            value={controls.status}
            onChange={(event) => updateControl("status", event.target.value)}
            className={`${selectClassName} mt-1 w-full`}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-[#c6dedb]">
          Event date
          <input
            type="date"
            value={controls.date}
            onChange={(event) => updateControl("date", event.target.value)}
            className={`${selectClassName} mt-1 w-full`}
          />
        </label>

        <label className="text-sm font-semibold text-[#c6dedb]">
          Sort by
          <select
            value={controls.sort}
            onChange={(event) => updateControl("sort", event.target.value)}
            className={`${selectClassName} mt-1 w-full`}
          >
            <option value="upcoming">Upcoming events</option>
            <option value="name">Event name</option>
            <option value="seats">Available seats</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default EventControls;
