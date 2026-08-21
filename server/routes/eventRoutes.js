const express = require("express");
const Event = require("../models/events");
const Registration = require("../models/registration");
const { protect, requireRole } = require("../middleware/auth");
const {
  canTransition,
  deriveRegistrationStatus,
  serializeEvent,
  validateEventPayload,
} = require("../utils/eventUtils");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const {
      search,
      eventName,
      resourcePerson,
      venue,
      eventType,
      registrationStatus,
      lifecycleStatus,
      sortBy = "upcoming",
      sortOrder = "asc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { eventName: { $regex: search, $options: "i" } },
        { resourcePerson: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }

    if (eventName) {
      query.eventName = { $regex: eventName, $options: "i" };
    }

    if (resourcePerson) {
      query.resourcePerson = { $regex: resourcePerson, $options: "i" };
    }

    if (venue) {
      query.venue = { $regex: venue, $options: "i" };
    }

    if (eventType) {
      query.eventType = eventType;
    }

    if (lifecycleStatus) {
      query.lifecycleStatus = lifecycleStatus;
    }

    const dbEvents = await Event.find(query);

    let events = dbEvents.map((event) => serializeEvent(event, req.user._id));

    if (registrationStatus) {
      events = events.filter(
        (event) =>
          event.registrationStatus === String(registrationStatus).toLowerCase(),
      );
    }

    const direction = sortOrder === "desc" ? -1 : 1;

    events.sort((a, b) => {
      if (sortBy === "eventName") {
        return a.eventName.localeCompare(b.eventName) * direction;
      }

      if (sortBy === "availableSeats") {
        return (a.availableSeats - b.availableSeats) * direction;
      }

      return (
        (new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()) *
        direction
      );
    });

    return res.json({
      count: events.length,
      events,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
});

router.get(
  "/stats/registrations",
  protect,
  requireRole("admin"),
  async (req, res) => {
    try {
      const events = await Event.find({});

      const totalEvents = events.length;
      const totalRegistrations = events.reduce(
        (sum, event) => sum + event.registeredCount,
        0,
      );
      const byType = events.reduce((acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      }, {});

      const lifecycleDistribution = events.reduce((acc, event) => {
        acc[event.lifecycleStatus] = (acc[event.lifecycleStatus] || 0) + 1;
        return acc;
      }, {});

      const registrationDistribution = events.reduce((acc, event) => {
        const status = deriveRegistrationStatus(event);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      return res.json({
        totalEvents,
        totalRegistrations,
        averageRegistrationPerEvent: totalEvents
          ? totalRegistrations / totalEvents
          : 0,
        byType,
        lifecycleDistribution,
        registrationDistribution,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to fetch statistics", error: error.message });
    }
  },
);

router.get("/:eventId", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({ event: serializeEvent(event, req.user._id) });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch event", error: error.message });
  }
});

router.post("/", protect, requireRole("admin"), async (req, res) => {
  try {
    const errors = validateEventPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const event = await Event.create({
      eventName: req.body.eventName,
      eventType: req.body.eventType,
      resourcePerson: req.body.resourcePerson,
      description: req.body.description || "",
      eventDate: req.body.eventDate,
      venue: req.body.venue,
      maxParticipants: Number(req.body.maxParticipants),
      lifecycleStatus: req.body.lifecycleStatus || "draft",
    });

    return res.status(201).json({
      message: "Event created",
      event: serializeEvent(event, req.user._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create event", error: error.message });
  }
});

router.patch("/:eventId", protect, requireRole("admin"), async (req, res) => {
  try {
    const errors = validateEventPayload(req.body, { partial: true });

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const fields = [
      "eventName",
      "eventType",
      "resourcePerson",
      "description",
      "eventDate",
      "venue",
      "maxParticipants",
    ];

    fields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        event[field] =
          field === "maxParticipants"
            ? Number(req.body[field])
            : req.body[field];
      }
    });

    if (event.maxParticipants < event.registeredCount) {
      return res.status(400).json({
        message: "Max participants cannot be less than current registrations.",
      });
    }

    await event.save();

    await Registration.updateMany(
      { eventId: event._id },
      {
        $set: {
          "eventDetails.eventName": event.eventName,
          "eventDetails.eventType": event.eventType,
          "eventDetails.resourcePerson": event.resourcePerson,
          "eventDetails.eventDate": event.eventDate,
          "eventDetails.venue": event.venue,
        },
      },
    );

    return res.json({
      message: "Event updated",
      event: serializeEvent(event, req.user._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update event", error: error.message });
  }
});

router.patch(
  "/:eventId/lifecycle",
  protect,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { lifecycleStatus } = req.body;

      if (!lifecycleStatus) {
        return res
          .status(400)
          .json({ message: "Lifecycle status is required." });
      }

      const event = await Event.findById(req.params.eventId);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (!canTransition(event.lifecycleStatus, lifecycleStatus)) {
        return res.status(400).json({
          message:
            "Invalid lifecycle transition. Allowed flow: draft -> published -> registration_open -> closed -> event_completed.",
        });
      }

      event.lifecycleStatus = lifecycleStatus;

      if (
        lifecycleStatus === "closed" ||
        lifecycleStatus === "event_completed"
      ) {
        // Keep registration counters unchanged and only lock the registration state.
      }

      await event.save();

      return res.json({
        message: "Lifecycle updated",
        event: serializeEvent(event, req.user._id),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to update lifecycle", error: error.message });
    }
  },
);

router.post(
  "/:eventId/register",
  protect,
  requireRole("student"),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.lifecycleStatus !== "registration_open") {
        return res
          .status(400)
          .json({ message: "Registration is not open for this event." });
      }

      if (event.registeredCount >= event.maxParticipants) {
        return res.status(400).json({ message: "Seats are full." });
      }

      const alreadyRegistered = event.registrations.some(
        (registration) => String(registration.student) === String(req.user._id),
      );

      if (alreadyRegistered) {
        return res
          .status(409)
          .json({ message: "You have already registered for this event." });
      }

      event.registrations.push({ student: req.user._id });
      event.registeredCount += 1;
      await event.save();

      await Registration.create({
        studentId: req.user._id,
        eventId: event._id,
        eventDetails: {
          eventName: event.eventName,
          eventType: event.eventType,
          resourcePerson: event.resourcePerson,
          eventDate: event.eventDate,
          venue: event.venue,
        },
      });

      return res.status(201).json({
        message: "Registration successful",
        event: serializeEvent(event, req.user._id),
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to register for event",
        error: error.message,
      });
    }
  },
);

router.delete("/:eventId", protect, requireRole("admin"), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Registration.deleteMany({ eventId: event._id });

    return res.json({ message: "Event deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete event", error: error.message });
  }
});

module.exports = router;
