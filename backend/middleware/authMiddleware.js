// // file: backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const UserAccount = require("../models/UserAccount");

// Protect routes middleware
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Unauthorized." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Fetch user from DB and attach to request
    const user = await UserAccount.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found." });

    req.user = user; // makes user info available in controller
    next();
  } catch (err) {
    console.error("JWT auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { authenticateUser };
