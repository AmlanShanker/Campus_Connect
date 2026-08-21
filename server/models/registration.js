const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    eventDetails: {
      eventName: { type: String, required: true },
      eventType: { type: String, required: true },
      resourcePerson: { type: String, required: true },
      eventDate: { type: Date, required: true },
      venue: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
