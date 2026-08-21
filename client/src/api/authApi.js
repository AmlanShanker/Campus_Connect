import http from "./http";

export async function registerAccount(payload) {
  const response = await http.post("/api/auth/register", payload);
  return response.data;
}

export async function loginAccount(payload) {
  const response = await http.post("/api/auth/login", payload);
  return response.data;
}
