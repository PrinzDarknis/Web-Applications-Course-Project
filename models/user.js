const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  privacy: {
    type: String,
    enum: ["everyone", "registered", "friends", "private"],
    default: "everyone",
  },
  friends: [
    {
      type: mongoose.ObjectId,
      ref: "Users",
    },
  ],
  friendsAsked: [
    {
      type: mongoose.ObjectId,
      ref: "Users",
    },
  ],
});

UserSchema.static("getUserByUsername", function (username, callback) {
  const query = { username: username };
  User.findOne(query, callback);
});

UserSchema.static("isUsernameTaken", function (username, callback) {
  User.findOne({ username }, (err, user) => {
    if (err) return callback(err, null);
    if (user) return callback(null, true);
    callback(null, false);
  });
});

UserSchema.method("hashAndSave", function (callback) {
  bycrypt.genSalt(10, (err, salt) => {
    bycrypt.hash(this.password, salt, (err, hash) => {
      if (err) throw err;
      this.password = hash;
      this.save(callback);
    });
  });
});

UserSchema.method("checkPassword", function (candidatePassword, callback) {
  bycrypt.compare(candidatePassword, this.password, callback);
});

UserSchema.method("getTransmitObjet", function (callback, privacy = false) {
  this.populate({ path: "friends", select: "username _id" }, (err, extUser) => {
    if (err) callback(err, null);
    extUser.populate(
      { path: "friendsAsked", select: "username _id" },
      (err, extUser) => {
        if (err) return callback(err, null);

        if (privacy) {
          return callback(null, {
            id: extUser._id,
            name: extUser.name,
            username: extUser.username,
            friendsAsked: extUser.friendsAsked,
          });
        }

        return callback(null, {
          id: extUser._id,
          name: extUser.name,
          username: extUser.username,
          email: extUser.email,
          privacy: extUser.privacy,
          friends: extUser.friends,
          friendsAsked: extUser.friendsAsked,
        });
      }
    );
  });
});

const User = (module.exports = mongoose.model("Users", UserSchema));
