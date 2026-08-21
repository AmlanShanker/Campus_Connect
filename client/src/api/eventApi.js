import http from "./http";

export async function fetchEvents(params = {}) {
  const response = await http.get("/api/events", { params });
  return response.data;
}

export async function createEvent(payload) {
  const response = await http.post("/api/events", payload);
  return response.data;
}

export async function updateEvent(eventId, payload) {
  const response = await http.patch(`/api/events/${eventId}`, payload);
  return response.data;
}

export async function deleteEvent(eventId) {
  const response = await http.delete(`/api/events/${eventId}`);
  return response.data;
}

export async function registerForEvent(eventId) {
  const response = await http.post(`/api/events/${eventId}/register`);
  return response.data;
}

export async function updateEventLifecycle(eventId, lifecycleStatus) {
  const response = await http.patch(`/api/events/${eventId}/lifecycle`, {
    lifecycleStatus,
  });
  return response.data;
}
