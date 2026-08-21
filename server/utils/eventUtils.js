const allowedLifecycle = [
  "draft",
  "published",
  "registration_open",
  "closed",
  "event_completed",
];

const allowedTransitions = {
  draft: ["published"],
  published: ["registration_open"],
  registration_open: ["closed"],
  closed: ["event_completed"],
  event_completed: [],
};

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function validateEventPayload(payload, { partial = false } = {}) {
  const errors = [];
  const hasValue = (key) => Object.prototype.hasOwnProperty.call(payload, key);

  if (!partial || hasValue("eventName")) {
    if (!payload.eventName || !String(payload.eventName).trim()) {
      errors.push("Event name is required.");
    }
  }

  if (!partial || hasValue("eventType")) {
    if (!payload.eventType || !String(payload.eventType).trim()) {
      errors.push("Event type must be selected.");
    }
  }

  if (!partial || hasValue("resourcePerson")) {
    if (!payload.resourcePerson || !String(payload.resourcePerson).trim()) {
      errors.push("Resource person is required.");
    }
  }

  if (!partial || hasValue("eventDate")) {
    if (!payload.eventDate) {
      errors.push("Event date is required.");
    } else {
      const parsedDate = new Date(payload.eventDate);

      if (Number.isNaN(parsedDate.getTime())) {
        errors.push("Event date is invalid.");
      } else if (parsedDate < startOfToday()) {
        errors.push("Past date should not be selected.");
      }
    }
  }

  if (!partial || hasValue("maxParticipants")) {
    const max = Number(payload.maxParticipants);

    if (!Number.isFinite(max) || max <= 0 || !Number.isInteger(max)) {
      errors.push("Max participants should be a positive number.");
    }
  }

  if (!partial || hasValue("venue")) {
    if (!payload.venue || !String(payload.venue).trim()) {
      errors.push("Venue is required.");
    }
  }

  if (
    hasValue("lifecycleStatus") &&
    !allowedLifecycle.includes(payload.lifecycleStatus)
  ) {
    errors.push("Invalid lifecycle status.");
  }

  return errors;
}

function canTransition(from, to) {
  if (from === to) {
    return true;
  }

  const nextStates = allowedTransitions[from] || [];
  return nextStates.includes(to);
}

function deriveRegistrationStatus(event) {
  const availableSeats = Math.max(
    event.maxParticipants - event.registeredCount,
    0,
  );

  if (event.lifecycleStatus === "registration_open") {
    return availableSeats > 0 ? "open" : "full";
  }

  if (event.lifecycleStatus === "closed") {
    return "closed";
  }

  if (event.lifecycleStatus === "event_completed") {
    return "completed";
  }

  return "not_open";
}

function countdownSeconds(eventDate) {
  const ms = new Date(eventDate).getTime() - Date.now();
  return Math.max(Math.floor(ms / 1000), 0);
}

function serializeEvent(eventDoc, currentUserId) {
  const event = eventDoc.toObject ? eventDoc.toObject() : eventDoc;
  const availableSeats = Math.max(
    event.maxParticipants - event.registeredCount,
    0,
  );
  const registrationStatus = deriveRegistrationStatus(event);

  return {
    id: event._id,
    eventName: event.eventName,
    eventType: event.eventType,
    resourcePerson: event.resourcePerson,
    description: event.description || "",
    eventDate: event.eventDate,
    venue: event.venue,
    maxParticipants: event.maxParticipants,
    registeredCount: event.registeredCount,
    availableSeats,
    lifecycleStatus: event.lifecycleStatus,
    registrationStatus,
    isUpcoming: new Date(event.eventDate).getTime() > Date.now(),
    countdownSeconds: countdownSeconds(event.eventDate),
    isRegistered:
      !!currentUserId &&
      (event.registrations || []).some(
        (registration) =>
          String(registration.student) === String(currentUserId),
      ),
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

module.exports = {
  allowedLifecycle,
  canTransition,
  deriveRegistrationStatus,
  serializeEvent,
  validateEventPayload,
};
