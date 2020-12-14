const express = require("express");
const passport = require("passport");
const { check } = require("express-validator");
const usersController = require("../controller/users");
const { checkValidate } = require("../middleware");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    check("username", "min. length 3").trim().isString().isLength({ min: 3 }),
    check("password", "min. length 3").trim().isString().isLength({ min: 3 }),
    checkValidate,
  ],
  usersController.register
);

// Authenticate
router.post(
  "/authenticate",
  [
    check("username", "needs Username").trim().isString().isLength({ min: 1 }),
    check("password", "needs Password").trim().isString().isLength({ min: 1 }),
    checkValidate,
  ],
  usersController.authenticate
);

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  usersController.profile
);

module.exports = router;
