// File: backend/models/UserAccount.js
const mongoose = require("mongoose");

const userAccountSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  role: { type: String, enum: ["client_user", "recruiter", "vendor", "hr"], required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  isTeamLead: { type: Boolean, default: false }
});

module.exports = mongoose.model("UserAccount", userAccountSchema);
