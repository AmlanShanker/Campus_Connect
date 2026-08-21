const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

module.exports = connectDB;
