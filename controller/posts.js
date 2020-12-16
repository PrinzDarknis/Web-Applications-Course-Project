const { json } = require("express");
const mongoose = require("mongoose");

const logger = require("../logger");
const Post = require("../models/post");

// Get List of Posts
// Params: newer, older, max, author
exports.getPosts = function (req, res) {
  Post.getPosts(
    req.user,
    req.query.newer,
    req.query.older,
    req.query.max,
    req.query.author,
    (err, posts) => {
      if (err) {
        logger.logError("Error in getPosts", err);
        return res.status(500).json({ success: false, msg: err.message });
      }

      res.json({ success: true, result: posts });
    }
  );
};

// Get Single Post
exports.getPost = function (req, res) {
  res.json({ success: true, result: req.post });
};

exports.getImage = function (req, res) {
  // TODO Image
};

// Write Post
exports.writePost = function (req, res) {
  // TODO Image
  let post = new Post({
    title: req.body.title,
    text: req.body.text,
    author: req.user._id,
  });

  post.save((err, newPost) => {
    if (err) {
      logError("Error while write Post", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    res.json({ success: true, result: newPost });
  });
};

// Write Comment
exports.writeComment = function (req, res) {
  let comment = {
    _id: mongoose.Types.ObjectId(), // self generated, other cannot find again after save
    text: req.body.text,
    author: req.user._id,
    date: Date.now(),
  };

  req.post.comments.push(comment);
  req.post.save((err, newPost) => {
    if (err) {
      logError("Error while write Comment", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    res.json({ success: true, result: comment });
  });
};

// Middleware
// Errors: Error404 Error500
exports.MW_getPostByID = function (req, res, next) {
  // find Book
  Post.findById(req.params.id).exec((err, post) => {
    if (err) {
      logger.logError("Error in Get Post by ID", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    if (post == null) {
      return res.status(404).json({ success: false, msg: "Cannot find Post" });
    }

    req.post = post;
    next();
  });
};
