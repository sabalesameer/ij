const express = require("express");
const router = express.Router();
const { registerEmployee, loginEmployee } = require("../controller/employeeController");
// Register a new employee
router.post("/register", registerEmployee);
// Login an existing employee
router.post("/login", loginEmployee);
module.exports = router;