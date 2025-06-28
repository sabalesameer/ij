const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  work_experience: { type: String, default: "0" },  
  education: { type: String, default: "Not specified" },
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  resume_url: { type: String, default: "" },
  profile_picture_url: { type: String, default: "" },
  linkedIn_url: { type: String, default: "" },
  password: { type: String, required: true, minlength: 6 },
  is_verified: { type: Boolean, default: false },
  account_status: { type: String, default: "active" }
}, { timestamps: true });

// 🔐 Hash password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare entered password with hashed password
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Employee", employeeSchema);
