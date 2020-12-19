const mongoose = require("mongoose");

const logger = require("../logger");

const imageNormalSize = 1000;
const imageSmallSize = 450;

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
    ref: "Users",
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
        ref: "Users",
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

PostSchema.static(
  "getPosts",
  function (user, newer, older, max, author, callback) {
    let filter = {};

    // Privacy
    if (user) {
      // Registered
      logger.logDebug("getPosts, filter: advanced");
      filter = {
        $or: [
          // Public
          { "author.privacy": "everyone" },
          //Registered
          { "author.privacy": "registered" },
          //Friends
          {
            $and: [
              { "author.privacy": "friends" },
              {
                "author.friends": {
                  $elemMatch: { $eq: user._id },
                },
              },
            ],
          },
          {
            $and: [{ "author.privacy": "friends" }, { "author._id": user._id }], // Author self
          },
          // Private
          {
            $and: [{ "author.privacy": "private" }, { "author._id": user._id }],
          },
        ],
      };
    } else {
      // Only Public
      logger.logDebug("getPosts, filter: only Public Posts");
      filter = {
        "author.privacy": "everyone",
      };
    }

    //Author
    if (author) {
      logger.logDebug("getPosts, filter: only from author");
      try {
        filter["author._id"] = mongoose.Types.ObjectId(author); // aggregate needs Object and not String
      } catch {
        // Invalide ObjectID
        callback(null, []); // no Results
      }
    }

    // newer
    if (newer) {
      filter.postDate = { $gt: newer };
    }

    // older
    if (older) {
      filter.postDate = { $lt: older };
    }

    // max
    let limit = {
      $limit: max,
    };

    // Search
    Post.aggregate([
      substituteAuthorIdWithAuthor,
      AuthorArraytoObject,
      // Aplly Filter
      {
        $match: filter,
      },
      FilterOutputFields,
      orderByPostDate,
      limit,
    ]).exec(callback);
  }
);

PostSchema.method("postPopulate", function (callback) {
  this.populate({ path: "author", select: "username _id" }, (err, tempPost) => {
    if (err) return callback(err, null);

    tempPost.populate(
      { path: "comments.author", select: "username _id" },
      (err, post) => {
        if (err) return callback(err, null);

        // Filter Image
        post.imageData = undefined;
        post.imageDataSmall = undefined;

        callback(null, post);
      }
    );
  });
});

const Post = (module.exports = mongoose.model("Posts", PostSchema));
module.exports.imageSmallSize = imageSmallSize;
module.exports.imageNormalSize = imageNormalSize;

// Methode from DB Version
var substituteAuthorIdWithAuthor;
var FilterOutputFields;
switch (process.env.MongoDbVersion) {
  // aggregate Filter
  default:
    logger.logInit(`Invalide MongoDbVersion: ${process.env.MongoDbVersion}`);
  case "3.6":
  case undefined:
    logger.logInit(`load MongoDbVersion 3.6`);
    substituteAuthorIdWithAuthor = {
      // join
      $lookup: {
        from: "users",
        let: { author_id: "$author" }, // let author_id = author (Variable for use in pipe)
        pipeline: [
          // author match id
          { $match: { $expr: { $eq: ["$_id", "$$author_id"] } } },
          // Show only ID and Username of Author
          {
            $project: {
              _id: 1,
              username: 1,
              privacy: 1,
              friends: 1,
            },
          },
        ],
        as: "author",
      },
    };

    FilterOutputFields = {
      $project: {
        comments: 0,
        "author.privacy": 0,
        "author.friends": 0,
        imageData: 0,
        imageDataSmall: 0,
      },
    };
    break;
  case "3.2":
    logger.logInit(`load MongoDbVersion 3.2`);
    substituteAuthorIdWithAuthor = {
      // join
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    };

    FilterOutputFields = {
      $project: {
        _id: 1,
        title: 1,
        text: 1,
        "author._id": 1,
        "author.username": 1,
        postDate: 1,
        image: 1,
      },
    };
}
const AuthorArraytoObject = { $unwind: "$author" }; // Author replace array with object

const orderByPostDate = {
  $sort: {
    postDate: -1, // newest first
  },
};
