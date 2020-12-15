const mongoose = require("mongoose");

// Post Schema
const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.ObjectId,
    required: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: Boolean,
    default: false,
  },
  imageData: {
    data: Buffer,
    contentType: String,
  },
  imageDataSmall: {
    data: Buffer,
    contentType: String,
  },
  comments: [
    {
      author: {
        type: mongoose.ObjectId,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Post = (module.exports = mongoose.model("Posts", PostSchema));
