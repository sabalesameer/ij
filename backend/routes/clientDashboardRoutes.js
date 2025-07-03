// file: backend/routes/clientDashboardRoutes.js
const express = require("express");
const router = express.Router();
const { createUserUnderClient } = require("../controller/clientDashboardController");

// You can add authentication middleware here if needed
// Example: const { authenticateClient } = require("../middleware/authMiddleware");

router.post("/client/:clientId/create-user", createUserUnderClient);

module.exports = router;
