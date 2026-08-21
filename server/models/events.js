const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ["Technical", "Academic", "Workshop", "Seminar", "Other"],
    },
    resourcePerson: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lifecycleStatus: {
      type: String,
      enum: [
        "draft",
        "published",
        "registration_open",
        "closed",
        "event_completed",
      ],
      default: "draft",
      required: true,
    },
    registrations: {
      type: [registrationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({ eventName: "text", resourcePerson: "text", venue: "text" });

module.exports = mongoose.model("Event", eventSchema);
