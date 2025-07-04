// file: backend/routes/clientDashboardRoutes.js
const express = require("express");
const router = express.Router();
const { createUserUnderClient ,assignTeamLeadRecruiter,getClientUsers} = require("../controller/clientDashboardController");

router.post("/client/:clientId/create-user", createUserUnderClient);

router.put("/client/:clientId/recruiter/:recruiterId/assign-team-lead", assignTeamLeadRecruiter);

router.get("/client/:clientId/users", getClientUsers);


module.exports = router;
