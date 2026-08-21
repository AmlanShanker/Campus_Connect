const jwt = require("jsonwebtoken");
const Account = require("../models/account");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Account.findById(payload.id).select("name email role");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
}

module.exports = { protect, requireRole };
