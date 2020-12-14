const { validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");

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
      .json({ session: false, msg: "invalid recource ID", id: req.params.id });
  }

  next();
};

module.exports.authenticateOptional = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    req.user = user; // User or false
    next();
  });
};
