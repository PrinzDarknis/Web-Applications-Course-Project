const { validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const passport = require("passport");
const { logError, logDebug } = require("./logger");

module.exports.checkValidate = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalide input", error: errors.errors });
  }

  next();
};

module.exports.checkID = function (req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, msg: "invalid recource ID", id: req.params.id });
  }

  next();
};

module.exports.authenticateOptional = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      logError("Error in {passport.authenticate} in authenticateOptional", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    req.user = user; // User or false
    logDebug(user ? `User: ${user.username}` : "No Authent User");

    next();
  })(req, res, next);
};
