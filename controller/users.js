const jwt = require("jsonwebtoken");

const logger = require("../logger");
const User = require("../models/user");

// Register
exports.register = function (req, res, next) {
  // Username free?
  User.isUsernameTaken(req.body.username, (err, taken) => {
    if (err) {
      logger.logError("Error while check Username taken", err);
      return res
        .status(500)
        .json({ success: false, msg: "Failed to register user" });
    }

    if (taken) {
      return res.status(409).json({ success: false, msg: "Username is taken" });
    }

    // Create User
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    newUser.hashAndCreate((err, user) => {
      if (err) {
        logger.logError("Error while Register", err);
        return res
          .status(500)
          .json({ success: false, msg: "Failed to register user" });
      }

      res.json({ success: true, msg: "User registered" });
    });
  });
};

// Authenticate
exports.authenticate = function (req, res) {
  User.getUserByUsername(req.body.username, (err, user) => {
    if (err) {
      logger.logError("Error while get User in authenticate", err);
      return res.status(500).json({ success: false, msg: err.msg });
    }
    if (!user)
      return res
        .status(401)
        .json({ success: false, msg: "Wrong Username or Password" });

    user.checkPassword(req.body.password, (err, isMatch) => {
      if (err) {
        logger.logError("Error while get User in checkPassword", err);
        return res.status(500).json({ success: false, msg: err.msg });
      }

      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, msg: "Wrong Username or Password" });

      const userData = user.getTransmitObjet();

      const token = jwt.sign(userData, process.env.TOKEN_SECRET, {
        expiresIn: 604800, // 1 week
      });

      res.json({
        success: true,
        token: `JWT ${token}`,
        user: userData,
      });
    });
  });
};

// Profile
exports.profile = function (req, res) {
  res.json({ success: true, user: req.user.getTransmitObjet() });
};
