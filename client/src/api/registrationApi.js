import http from "./http";

export async function fetchRegistrations() {
  const response = await http.get("/api/registrations");
  return response.data;
}
