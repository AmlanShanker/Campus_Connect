import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  registerForEvent,
  updateEvent,
} from "./api/eventApi";
import { fetchRegistrations } from "./api/registrationApi";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/RegisterForm";
import { loginAccount, registerAccount } from "./api/authApi";
import { setAuthToken } from "./api/http";
import AdminPage from "./pages/AdminPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventsPage from "./pages/EventsPage";
import RegistrationsPage from "./pages/RegistrationsPage";

function mapLifecycleToUiStatus(lifecycleStatus, registrationStatus) {
  if (lifecycleStatus === "event_completed") {
    return "Completed";
  }

  if (lifecycleStatus === "closed" || registrationStatus === "full") {
    return "Closed";
  }

  if (lifecycleStatus === "registration_open") {
    return "Open";
  }

  return "Upcoming";
}

function mapEventFromApi(event) {
  return {
    id: event.id,
    name: event.eventName,
    type: event.eventType,
    resourcePerson: event.resourcePerson,
    description: event.description || "",
    date: new Date(event.eventDate).toISOString().slice(0, 10),
    venue: event.venue,
    maxParticipants: event.maxParticipants,
    registeredCount: event.registeredCount,
    status: mapLifecycleToUiStatus(
      event.lifecycleStatus,
      event.registrationStatus,
    ),
    lifecycleStatus: event.lifecycleStatus,
    registrationStatus: event.registrationStatus,
    countdownSeconds: event.countdownSeconds,
  };
}

function mapFormToEventPayload(formData) {
  const lifecycleMap = {
    Upcoming: "published",
    Open: "registration_open",
    Closed: "closed",
    Completed: "event_completed",
    Ongoing: "registration_open",
  };

  return {
    eventName: formData.name,
    eventType: formData.type,
    resourcePerson: formData.resourcePerson,
    description: formData.description,
    eventDate: formData.date,
    venue: formData.venue,
    maxParticipants: Number(formData.maxParticipants),
    lifecycleStatus: lifecycleMap[formData.status] || "draft",
  };
}

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    function restoreSession() {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (storedToken && storedUser) {
        setAuthToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
      }

      setAuthLoading(false);
    }

    restoreSession();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setEvents([]);
      setRegistrations([]);
      return;
    }

    loadDashboardData();
  }, [currentUser]);

  const studentRegistrations = useMemo(
    () =>
      registrations.filter(
        (registration) => registration.studentName === currentUser?.name,
      ),
    [registrations, currentUser],
  );

  async function loadDashboardData() {
    setEventsLoading(true);
    setDataError("");

    try {
      const [eventRes, registrationRes] = await Promise.all([
        fetchEvents(),
        fetchRegistrations(),
      ]);

      setEvents((eventRes.events || []).map(mapEventFromApi));
      setRegistrations(registrationRes.registrations || []);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load event data from backend.";
      setDataError(message);
    } finally {
      setEventsLoading(false);
    }
  }

  async function handleLogin(credentials) {
    setAuthSubmitting(true);
    try {
      const data = await loginAccount(credentials);

      setAuthToken(data.token);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setCurrentUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to login. Please check your credentials.",
      };
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleRegisterUser(formData) {
    setAuthSubmitting(true);

    try {
      const data = await registerAccount(formData);

      setAuthToken(data.token);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setCurrentUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to register account right now.",
      };
    } finally {
      setAuthSubmitting(false);
    }
  }

  function handleLogout() {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setCurrentUser(null);
    setSelectedEvent(null);
    setEvents([]);
    setRegistrations([]);
    setDataError("");
  }

  const role = currentUser?.role;

  async function handleRegister(eventId) {
    if (role !== "student") {
      return;
    }

    try {
      await registerForEvent(eventId);
      await loadDashboardData();
    } catch (error) {
      window.alert(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  }

  async function handleDeleteEvent(eventId) {
    try {
      await deleteEvent(eventId);
      setSelectedEvent((prev) => (prev?.id === eventId ? null : prev));
      await loadDashboardData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Unable to delete event right now.",
      );
    }
  }

  async function handleSubmitEvent(formData) {
    if (role !== "admin") {
      return;
    }

    const payload = mapFormToEventPayload(formData);

    if (selectedEvent) {
      try {
        await updateEvent(selectedEvent.id, payload);
        setSelectedEvent(null);
        await loadDashboardData();
        return;
      } catch (error) {
        const errorMessage =
          error.response?.data?.errors?.join(" ") ||
          error.response?.data?.message ||
          "Unable to update event.";
        window.alert(errorMessage);
        return;
      }
    }

    try {
      await createEvent(payload);
      await loadDashboardData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.join(" ") ||
        error.response?.data?.message ||
        "Unable to create event.";
      window.alert(errorMessage);
    }
  }

  function handleEditEvent(event) {
    if (role !== "admin") {
      return;
    }

    setSelectedEvent(event);
  }

  function handleCancelEdit() {
    setSelectedEvent(null);
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#cffafe,#f8fafc_48%,#e2e8f0_100%)] px-4">
        <p className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          Loading accounts...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="auth-shell min-h-screen px-4 py-10">
        <Routes>
          <Route
            path="/login"
            element={
              <LoginForm onLogin={handleLogin} loading={authSubmitting} />
            }
          />
          <Route
            path="/register"
            element={
              <RegisterForm
                onRegister={handleRegisterUser}
                loading={authSubmitting}
              />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen">
      <Navbar user={currentUser} onLogout={handleLogout} />

      <main className="app-main mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {dataError && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {dataError}
          </div>
        )}

        {eventsLoading && (
          <div className="mb-4 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
            Syncing with backend...
          </div>
        )}

        <Routes>
          <Route
            path="/student"
            element={
              role === "student" ? (
                <EventsPage
                  events={events}
                  role="student"
                  registrations={studentRegistrations}
                  onRegister={handleRegister}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          <Route
            path="/student/events/:eventId"
            element={
              role === "student" ? (
                <EventDetailsPage
                  events={events}
                  role="student"
                  onRegister={handleRegister}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          <Route
            path="/student/registrations"
            element={
              role === "student" ? (
                <RegistrationsPage
                  role="student"
                  registrations={studentRegistrations}
                />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          <Route
            path="/admin"
            element={
              role === "admin" ? (
                <AdminPage
                  role="admin"
                  events={events}
                  selectedEvent={selectedEvent}
                  registrations={registrations}
                  onSubmitEvent={handleSubmitEvent}
                  onCancelEdit={handleCancelEdit}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ) : (
                <Navigate to="/student" replace />
              )
            }
          />

          <Route
            path="/admin/events"
            element={
              role === "admin" ? (
                <EventsPage
                  events={events}
                  role="admin"
                  onRegister={handleRegister}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ) : (
                <Navigate to="/student" replace />
              )
            }
          />

          <Route
            path="/admin/events/:eventId"
            element={
              role === "admin" ? (
                <EventDetailsPage
                  events={events}
                  role="admin"
                  onRegister={handleRegister}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ) : (
                <Navigate to="/student" replace />
              )
            }
          />

          <Route
            path="/admin/registrations"
            element={
              role === "admin" ? (
                <RegistrationsPage role="admin" registrations={registrations} />
              ) : (
                <Navigate to="/student" replace />
              )
            }
          />

          <Route
            path="/"
            element={
              <Navigate to={role === "admin" ? "/admin" : "/student"} replace />
            }
          />

          <Route
            path="*"
            element={
              <Navigate to={role === "admin" ? "/admin" : "/student"} replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
