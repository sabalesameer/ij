const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

require('dotenv').config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/employees", require("./routes/employeeRoute"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));