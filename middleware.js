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
      .json({ msg: "invalid recource ID", id: req.params.id });
  }

  next();
};
