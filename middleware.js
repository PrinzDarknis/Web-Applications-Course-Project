const { validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const passport = require("passport");
const { logError, logDebug } = require("./logger");

// Errors: ErrorParams
module.exports.checkValidate = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalide input", error: errors.errors });
  }

  next();
};

// Errors: ErrorID
module.exports.checkID = function (req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, msg: "invalid recource ID", id: req.params.id });
  }

  next();
};

// Errors: Error500
module.exports.authenticateOptional = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      logError("Error in {passport.authenticate} in authenticateOptional", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    req.user = user; // User or false
    logDebug(
      user
        ? `Authenticate Optional: User ${user.username}`
        : "Authenticate Optional: No Authent User"
    );

    next();
  })(req, res, next);
};

// isDate of express validator doesn't work (false id value is "2020-12-16T14:25:51.722Z")
module.exports.validateIsDate = function (value) {
  return !isNaN(Date.parse(value));
};
