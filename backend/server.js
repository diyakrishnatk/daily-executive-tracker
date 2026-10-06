const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const dns = require("dns");

const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");

dns.setServers(["8.8.8.8"]);

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Activity routes
app.use("/api/activities", activityRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Daily Executive Activity Tracker API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});