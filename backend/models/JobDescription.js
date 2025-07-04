// // file: backend/models/JobDescription.js
const mongoose = require("mongoose");

const jobDescriptionSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }, // optional, can be null
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String, enum: ["fulltime", "intern", "hybrid"], required: true },
  experienceLevel: { type: String, required: true },
  salary: { type: String, required: true },
  jobDescription: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("JobDescription", jobDescriptionSchema);
