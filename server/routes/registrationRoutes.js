const express = require("express");
const Registration = require("../models/registration");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { studentId: req.user._id };

    const registrations = await Registration.find(query)
      .populate("studentId", "name email role")
      .sort({ createdAt: -1 });

    const mapped = registrations.map((item) => ({
      id: item._id,
      studentId: item.studentId?._id,
      studentName: item.studentId?.name || "Unknown",
      studentEmail: item.studentId?.email || "",
      eventId: item.eventId,
      eventName: item.eventDetails.eventName,
      eventType: item.eventDetails.eventType,
      resourcePerson: item.eventDetails.resourcePerson,
      eventDate: item.eventDetails.eventDate,
      venue: item.eventDetails.venue,
      registrationStatus: "Open",
      createdAt: item.createdAt,
    }));

    return res.json({ count: mapped.length, registrations: mapped });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
});

router.get("/stats", protect, requireRole("admin"), async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();

    const byEventType = await Registration.aggregate([
      {
        $group: {
          _id: "$eventDetails.eventType",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.json({
      totalRegistrations,
      byEventType,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch registration stats",
      error: error.message,
    });
  }
});

module.exports = router;
