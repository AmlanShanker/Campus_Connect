import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  type: "Technical",
  resourcePerson: "",
  date: "",
  venue: "",
  maxParticipants: 40,
  status: "Open",
  description: "",
};

function EventForm({ selectedEvent, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (selectedEvent) {
      const { registeredCount, id, ...rest } = selectedEvent;
      setForm(rest);
      return;
    }

    setForm(emptyForm);
  }, [selectedEvent]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "maxParticipants" ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
    setForm(emptyForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-900">
        {selectedEvent ? "Edit Event" : "Add Event"}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Event Name
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Event Type
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          >
            <option value="Technical">Technical</option>
            <option value="Academic">Academic</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Resource Person
          <input
            required
            name="resourcePerson"
            value={form.resourcePerson}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Event Date
          <input
            required
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Venue
          <input
            required
            name="venue"
            value={form.venue}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Maximum Participants
          <input
            required
            type="number"
            min="1"
            name="maxParticipants"
            value={form.maxParticipants}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Lifecycle Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Description
          <textarea
            rows="3"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          className="create-event-button rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {selectedEvent ? "Update Event" : "Create Event"}
        </button>
        {selectedEvent && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default EventForm;
