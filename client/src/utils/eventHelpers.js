export function getAvailableSeats(event) {
  return Math.max(event.maxParticipants - event.registeredCount, 0);
}

export function canStudentRegister(event) {
  if (event.status !== "Open") {
    return false;
  }

  return getAvailableSeats(event) > 0;
}

export function formatEventDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
