// // File: backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const clientDashboardRoutes = require("./routes/clientDashboardRoutes");

require('dotenv').config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/dashboard", require("./routes/clientDashboardRoutes")); // Adjust base path as needed


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));