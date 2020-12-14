try {
  require("dotenv").config(); // in try becouse only dev dependency
} catch {}

// Requirements:
// TODO 15  Using React.js front-end
// TODO  5  Using redux and an advanced React architecture
// TOD-  5  Running your application in a Docker container (or having the application Docker compatible)
// TODO  5  Running your application in Rahti
// TODO  3  Having more than one container (such as a separate database server or a load balancer)
// TOD-  5  Using a database, such as Mongo, Redis, or any SQL-compatible
// TOD-  3  Use an ORM and models in backend, such as the Mongoose (MongoDB) or Sequelize (SQL)
// TODO  5  Supporting pictures storage and display
// TODO  3  Resize and validate the images after download - create a set of thumbnails on loading to be shown in different places
// TODO  4  Using XHR (also know as AJAX/AJAJ) for data transfer and frontend syncronization
// TOD-  5  User registration, authentication, and password storage
// TODO  2  Add access permissions: blog is open to everyone, to registered users, to specific users, to owner only
// TOD-  3  Provide data from your application through an API and document it with a suitable tool, e.g. with apiDoc or API Blueprint.

const express = require("express");
const path = require("path");
const cors = require("cors"); // allows request to different domains
const passport = require("passport");
const mongoose = require("mongoose");

const logger = require("./logger");
const usersRouter = require("./routes/users");

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

// Middleware: Passport
app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);

// Routes
app.use("/api/users", usersRouter);
app.use("/api", express.static(path.join(__dirname, "apidoc"))); // API Documentation

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
