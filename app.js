try {
  require("dotenv").config(); // in try becouse only dev dependency
} catch {}

const express = require("express");
const path = require("path");
const cors = require("cors"); // allows request to different domains
const passport = require("passport");
const mongoose = require("mongoose");

const logger = require("./logger");

// DB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  logger.logInit("Connected to Database");
});
mongoose.connection.on("error", (err) => {
  logger.logError("Database Error", err);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// static Frontend
app.use(express.static(path.join(__dirname, "public")));

// All else handeld by Frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(process.env.PORT, () => {
  logger.logInit(`Server started on Port ${process.env.PORT}`);
});
