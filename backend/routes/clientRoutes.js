const express = require("express");
const router = express.Router();
const { registerClient,loginClient  } = require("../controller/clientController");

router.post("/register", registerClient);

router.post('/login', loginClient);

module.exports = router;