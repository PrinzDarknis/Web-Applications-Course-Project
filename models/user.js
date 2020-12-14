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
  friends: [
    {
      type: String,
    },
  ],
  friendsAsked: [
    {
      type: String,
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

UserSchema.method("hashAndCreate", function (callback) {
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

UserSchema.method("getTransmitObjet", function () {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    friends: this.friends,
    friendsAsked: this.friendsAsked,
  };
});

const User = (module.exports = mongoose.model("Users", UserSchema));
