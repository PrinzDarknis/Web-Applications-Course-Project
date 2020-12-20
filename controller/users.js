const jwt = require("jsonwebtoken");

const logger = require("../logger");
const User = require("../models/user");

// Register
exports.register = function (req, res) {
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

    newUser.hashAndSave((err, user) => {
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

      user.getTransmitObjet((err, userData) => {
        if (err) {
          logger.logError("Error while getTransmitObjet in authenticate", err);
          return res.status(500).json({ success: false, msg: err.msg });
        }

        const token = jwt.sign(userData, process.env.TOKEN_SECRET, {
          expiresIn: 604800, // 1 week
        });

        res.json({
          success: true,
          token: `JWT ${token}`,
          result: userData,
        });
      });
    });
  });
};

// Profile
exports.profile = function (req, res) {
  let privacy =
    !req.user ||
    (!req.user._id.equals(req.targetUser._id) &&
      !req.targetUser.friends.includes(req.user._id));

  req.targetUser.getTransmitObjet((err, userdata) => {
    if (err) {
      logger.logError("Error while getTransmitObjet in authenticate", err);
      return res.status(500).json({ success: false, msg: err.msg });
    }

    res.json({
      success: true,
      result: userdata,
    });
  }, privacy);
};

// Change User
exports.changeUser = function (req, res, next) {
  // Him self?
  if (!req.targetUser._id.equals(req.user._id)) {
    logger.logDebug(
      `User ${req.user.username} tryed to change ${req.targetUser.username}`
    );
    return res.sendStatus(401);
  }

  let afterUsername = (err = null, taken = true) => {
    if (err) {
      logger.logError("Error while check Username taken in changeUser", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    if (!taken) {
      req.user.username = req.body.username;
    }

    // Password
    if (req.body.password) {
      req.user.password = req.body.password;
    }

    // Privacy
    if (req.body.privacy) {
      req.user.privacy = req.body.privacy;
    }

    // Save
    let afterSave = (err, newUser) => {
      if (err) {
        logger.logError("Error while change User Data", err);
        return res.status(500).json({ success: false, msg: err.message });
      }

      newUser.getTransmitObjet((err, userdata) => {
        if (err) {
          logger.logError("Error while getTransmitObjet in authenticate", err);
          return res.status(500).json({ success: false, msg: err.msg });
        }

        res.json({
          success: true,
          result: userdata,
        });
      });
    };

    if (req.body.password) req.user.hashAndSave(afterSave);
    else req.user.save(afterSave);
  };

  // Username
  if (req.body.username) {
    User.isUsernameTaken(req.body.username, afterUsername);
  } else afterUsername();
};

// askFriend
exports.askFriend = function (req, res) {
  // self?
  if (req.targetUser._id.equals(req.user._id)) {
    logger.logDebug("self befriend");
    return res.json({ success: true, state: "friend" });
  }

  // already friends?
  if (req.targetUser.friends.includes(req.user._id.toString())) {
    logger.logDebug("already Friends");
    return res.json({ success: true, state: "friend" });
  }

  //both asked? (target already asked user)
  if (req.user.friendsAsked.includes(req.targetUser._id.toString())) {
    logger.logDebug("both asked => make to friends");
    // remove asked
    req.user.friendsAsked.splice(
      req.user.friendsAsked.indexOf(req.targetUser._id.toString())
    );
    req.targetUser.friendsAsked.splice(
      req.targetUser.friendsAsked.indexOf(req.user._id.toString())
    );

    // set Friends
    req.user.friends.push(req.targetUser._id.toString());
    req.targetUser.friends.push(req.user._id.toString());

    // save
    User.startSession(null, (err, session) => {
      if (err) {
        logger.logError("Error save friendship at startSession", err);
        return session.abortTransaction(() => {
          return res
            .status(500)
            .json({ success: false, msg: "Failed to send Friendship" });
        });
      }

      session.startTransaction();

      // user
      req.user.save({ session }, (err, changedUser) => {
        if (err) {
          logger.logError("Error save friendship at save user", err);
          return session.abortTransaction(() => {
            return res
              .status(500)
              .json({ success: false, msg: "Failed to send Friendship" });
          });
        }

        // target
        req.targetUser.save({ session }, (err, changedTarget) => {
          if (err) {
            logger.logError("Error save friendship at save target", err);
            return session.abortTransaction(() => {
              return res
                .status(500)
                .json({ success: false, msg: "Failed to send Friendship" });
            });
          }

          // success
          session.commitTransaction((err) => {
            if (err) {
              logger.logError(
                "Error save friendship at commitTransaction",
                err
              );
              return res
                .status(500)
                .json({ success: false, msg: "Failed to send Friendship" });
            }

            return res.json({ success: true, state: "friend" });
          });
        });
      });
    });

    return;
  }

  //already asked?
  if (req.targetUser.friendsAsked.includes(req.user._id.toString())) {
    logger.logDebug("already asked");
    return res.json({ success: true, state: "asked" });
  }

  // ask
  logger.logDebug("ask for Friendship");
  req.targetUser.friendsAsked.push(req.user._id.toString());
  req.targetUser.save((err, changedTarget) => {
    if (err) {
      logger.logError("Error while ask for friendship", err);
      return res
        .status(500)
        .json({ success: false, msg: "Failed to send Friendship" });
    }

    return res.json({ success: true, state: "asked" });
  });
};

// Middleware
// Errors: Error404 Error500
exports.MW_getUserByID = function (req, res, next) {
  // find Book
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      logger.logError("Error in Get User by ID", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    if (user == null) {
      return res.status(404).json({ success: false, msg: "Cannot find User" });
    }

    req.targetUser = user;
    next();
  });
};

// Errors: ErrorPrivacy Error500
exports.MW_checkPrivacyForPost = function (req, res, next) {
  User.findById(req.post.author).exec((err, author) => {
    if (err) {
      logger.logError("Error in checkPrivacyForPost at get Author", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    // Check
    let allowed = false;
    switch (author.privacy) {
      case "private":
        if (req.user) allowed = author._id.equals(req.user._id);
        break;
      case "friends":
        if (req.user)
          allowed =
            author._id.equals(req.user._id) ||
            author.friends.includes(req.user._id);
        break;
      case "registered":
        if (req.user) allowed = true; // not allowed = req.user because user is object
        break;
      case "everyone":
      default:
        allowed = true;
        break;
    }

    // evaluate
    if (!allowed) {
      return res.status(401).json({
        success: false,
        msg:
          "Following the Posts privacy you are not allowed to fetch the Data",
      });
    }

    logger.logDebug(
      `MW_checkPrivacyForPost: Privacy ${author.privacy}: allowed: ${allowed}`
    );
    next();
  });
};
