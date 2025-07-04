// File: backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB Connected");
} catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;