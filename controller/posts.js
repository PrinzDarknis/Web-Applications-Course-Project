const mongoose = require("mongoose");
const fs = require("fs");
const sharp = require("sharp");

const logger = require("../logger");
const Post = require("../models/post");
const User = require("../models/user");

// Get List of Posts
// Params: newer, older, max, author
exports.getPosts = function (req, res) {
  Post.getPosts(
    req.user,
    req.query.newer,
    req.query.older,
    req.query.max || 20,
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
  req.post.postPopulate((err, post) => {
    if (err) {
      logger.logError("Error in getPost while postPopulate", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    res.json({ success: true, result: post });
  });
};

exports.getImage = function (req, res) {
  if (!req.post.image) {
    return res.sendStatus(404);
  }

  //Check Params
  let size = "normal";
  if (typeof req.query.size == "string") size = req.query.size.toLowerCase();

  // Prep Error Handler
  let error = () => {
    logger.logError(
      `couldn't load Image from Database. Format: ${size}, PostID: ${req.post._id}`
    );
    res.sendStatus(404);
  };

  let img;
  switch (size) {
    case "normal":
      if (!req.post.imageData.data) return error();
      img = Buffer.from(req.post.imageData.data, "binary");
      break;
    case "small":
      if (!req.post.imageDataSmall.data) return error();
      img = Buffer.from(req.post.imageDataSmall.data, "binary");
      break;
    default:
      return res.status(400).json({
        success: false,
        msg: "Invalide input",
        error: [
          {
            value: req.params.size,
            msg: "Invalide Value, allowed: ['normal','small']",
            param: "size",
            location: "query",
          },
        ],
      });
  }

  res.writeHead(200, {
    "Content-Type": req.post.imageData.contentType,
    "Content-Length": img.length,
  });
  res.end(img);
};

// Write Post
exports.writePost = function (req, res) {
  req.body = JSON.parse(JSON.stringify(req.body)); //make body readable

  let post = new Post({
    title: req.body.title,
    text: req.body.text,
    author: req.user._id,
  });

  // Callback Save Post
  let nowSave = () => {
    post.save((err, newPost) => {
      if (err) {
        logError("Error while write Post", err);
        return res.status(500).json({ success: false, msg: err.message });
      }

      newPost.postPopulate((err, post) => {
        if (err) {
          logger.logError("Error in writePost while postPopulate", err);
          return res.status(500).json({ success: false, msg: err.message });
        }

        res.json({ success: true, result: post });
      });
    });
  };

  if (req.file) {
    // Resize Image Normal
    let resizeNormal = sharp(req.file.path)
      .resize({
        width: Post.imageNormalSize,
        height: Post.imageNormalSize,
        fit: sharp.fit.inside,
      })
      .toFormat("png")
      .png({ quality: 100 })
      .toBuffer();
    //.toFile(req.file.path + "_normal.png");

    // Resize Image Small
    let resizeSmall = sharp(req.file.path)
      .resize({
        width: Post.imageSmallSize,
        height: Post.imageSmallSize,
        fit: sharp.fit.inside,
      })
      .toFormat("png")
      .png({ quality: 100 })
      .toBuffer();
    //.toFile(req.file.path + "_small.png");

    // Save
    Promise.all([resizeNormal, resizeSmall])
      .then((erg) => {
        // Save Image
        post.image = true;
        post.imageData = {
          data: erg[0], // Buffer Normal
          contentType: "image/png",
        };
        post.imageDataSmall = {
          data: erg[1], // Buffer Small
          contentType: "image/png",
        };

        // Save
        nowSave();
      })
      .catch((err) => {
        logger.logError("Coudn't resize Image", err);
        res
          .status(500)
          .json({ success: false, message: "Coudn't process Image" });
      })
      .finally(() => {
        //Remove temp File
        fs.unlinkSync(req.file.path);
      });
  } else nowSave();
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

    // Insert Author
    comment.author = {
      _id: req.user._id,
      username: req.user.username,
    };

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
