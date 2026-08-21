const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Account = require("../models/account");

const router = express.Router();

function signToken(account) {
  return jwt.sign(
    {
      id: account._id,
      role: account.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await Account.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const account = await Account.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      role: "student",
    });

    const token = signToken(account);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const account = await Account.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!account) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const validPassword = await bcrypt.compare(password, account.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(account);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
