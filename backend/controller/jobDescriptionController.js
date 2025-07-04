// file: backend/controller/jobDescriptionController.js
const JobDescription = require("../models/JobDescription");
const Client = require("../models/Client");

exports.createJobDescription = async (req, res) => {
  const { clientId } = req.params;
  const {
    companyName, jobTitle, location,
    jobType, experienceLevel, salary, jobDescription,
    createdBy // optional: allow from body
  } = req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const job = new JobDescription({
      client: clientId,
      createdBy: createdBy || null, // pass if needed, else null
      companyName,
      jobTitle,
      location,
      jobType,
      experienceLevel,
      salary,
      jobDescription
    });

    await job.save();

    res.status(201).json({ message: "Job description created", job });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.getJobDescriptions = async (req, res) => {
  const { clientId } = req.params;

  try {
    const jobs = await JobDescription.find({ client: clientId })
      .populate("createdBy", "name email") // populate user details
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};