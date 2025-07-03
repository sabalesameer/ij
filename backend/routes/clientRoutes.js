const express = require("express");
const router = express.Router();
const clientController = require("../controller/clientController");

router.post("/register", clientController.registerClient);
router.post("/login", clientController.loginClient);

// ✅ Add this route
router.post("/:id/subscribe", clientController.subscribeClient);



module.exports = router;
