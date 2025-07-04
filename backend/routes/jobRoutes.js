// // file: backend/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const { createJobDescription } = require("../controller/jobDescriptionController");
// const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/client/:clientId/job", createJobDescription);
// router.get("/client/:clientId/jobs", getJobDescriptions);

module.exports = router;
