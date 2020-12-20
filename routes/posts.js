const express = require("express");
const { check } = require("express-validator");
const passport = require("passport");

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

const usersController = require("../controller/users");
const postsController = require("../controller/posts");
const {
  checkValidate,
  checkID,
  authenticateOptional,
  validateIsDate,
} = require("../middleware");

/**
 * @apiDefine Error404
 * @apiError PostNotFound The <code>id</code> of the Post was not found.
 * @apiErrorExample {json} PostNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "msg": "Cannot find Post"
 *     }
 */

/**
 * @apiDefine ErrorID
 * @apiError InvalideID The given <code>id</code> is invalide
 * @apiErrorExample {json} InvalideID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "success": false,
 *       "msg": "invalid recource ID",
 *       "id": "TheIvalideID"
 *     }
 */

/**
 * @apiDefine ErrorParams
 * @apiError InvalideParams same of the given params are invalide
 * @apiErrorExample {json} InvalideParams:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "success": false,
 *       "msg": "Invalide input",
 *       "error": [
 *          {
 *            "value": "invalide Value",
 *            "msg": "what is wrong",
 *            "param": "parameter Name",
 *            "location": "parameter location"
 *          }
 *       ]
 *     }
 */

/**
 * @apiDefine ErrorUnauthorized
 * @apiError Unauthorized needs valide JWT
 * @apiErrorExample Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 */

/**
 * @apiDefine ErrorPrivacy
 * @apiError Unauthorized Following the Posts privacy you are not allowed to fetch the Data.
 * @apiErrorExample {json} Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "success": false,
 *       "msg": "Following the Posts privacy you are not allowed to fetch the Data"
 *     }
 */

/**
 * @apiDefine Error500
 * @apiError (Error 5xx) ServerError Something happened on the Server Side
 * @apiErrorExample {json} ServerError:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "success": false,
 *       "msg": "Error message"
 *     }
 */

/**
 * @apiDefine apiSuccess_success
 * @apiSuccess {Boolean} success Was request successful?.
 */

/**
 * @apiDefine apiSuccess_PostAsResult
 * @apiSuccess {String} result._id ID of the Post.
 * @apiSuccess {String} result.title Title of the Post.
 * @apiSuccess {String} result.text Text of the Post.
 * @apiSuccess {String} result.author Author of the Post.
 * @apiSuccess {Date} result.postDate Creation Date of the Post.
 * @apiSuccess {Boolean} result.image Has the Post an Image?
 */

/**
 * @apiDefine apiSuccess_PostAsResult_Authorobject
 * @apiSuccess {String} result._id ID of the Post.
 * @apiSuccess {String} result.title Title of the Post.
 * @apiSuccess {String} result.text Text of the Post.
 * @apiSuccess {Object} result.author Author of the Post.
 * @apiSuccess {String} result.author._id <code>if</code> of the Author.
 * @apiSuccess {String} result.author.username Username of the Author.
 * @apiSuccess {Date} result.postDate Creation Date of the Post.
 * @apiSuccess {Boolean} result.image Has the Post an Image?
 */

/**
 * @apiDefine autorization_optional
 * @apiHeader (Optional Headers) {String} Authorization Authorization via JWT.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "JWT Ahjdkjsdjiw..."
 *     }
 */

/**
 * @apiDefine Content_Type_JSON
 * @apiHeader (Headers) {String} Content-Type must be <code>'application/json'</code>
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type" : "application/json"
 *     }
 */

/**
 * @apiDefine registered Olny registered Users
 */

/**
 * @apiDefine autorization
 * @apiHeader (Headers) {String} Authorization Authorization via JWT.
 * @apiHeader (Headers) {String} Content-Type must be <code>'application/json'</code>
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type" : "application/json"
 *       "Authorization": "JWT Ahjdkjsdjiw..."
 *     }
 */

/**
 * @apiDefine autorization_form_data
 * @apiHeader (Headers) {String} Authorization Authorization via JWT.
 * @apiHeader (Headers) {String} Content-Type must be <code>'multipart/form-data'</code> with boundary
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type" : "multipart/form-data"
 *       "Authorization": "JWT Ahjdkjsdjiw..."
 *     }
 */

const router = express.Router();

/**
 * @api {get} /api/posts Get List of Posts
 * @apiName GetPosts
 * @apiGroup Post
 * @apiDescription Gives Post without Comments to save Traffic
 *
 * @apiUse autorization_optional
 *
 * @apiParam {Date} newer Show only Post newer than these Date. (optional)
 * @apiParam {Date} older Show only Post older than these Date. (optional)
 * @apiParam {Number} max=20 Maximal number of Post deliverd (starting from newest). (optional)
 * @apiParam {String} author Show only Post from the User with these <code>id</code>. (optional)
 *
 * @apiUse apiSuccess_success
 * @apiSuccess {Object[]} result Array of Posts.
 * @apiUse apiSuccess_PostAsResult_Authorobject
 * @apiSuccess {Date} firstDate Date of the first Post (for loading more later).
 * @apiSuccess {Date} lastDate Date of the last Post (for loading more later).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "result": [
 *          {
 *            "_id": "10A46",
 *            "title": "Post Title",
 *            "text": "some text.",
 *            "author": {
 *              "_id": "5fda15344d46c345a00306ce",
 *              "username": "john"
 *            },
 *            "postDate": "15.12.2020 15:25:56",
 *            "image": "true"
 *          }
 *       ],
 *       "firstDate": "15.12.2020 15:25:56",
 *       "lastDate": "15.12.2020 15:25:56",
 *     }
 *
 * @apiUse ErrorParams
 * @apiUse Error500
 */
router.get(
  "/",
  [
    check("newer", "needs to be an valide Date")
      .trim()
      //.isDate() // doesn't work properly
      .custom(validateIsDate)
      .toDate()
      .optional(),
    check("older")
      .trim()
      //.isDate() // doesn't work properly
      .custom(validateIsDate)
      .toDate()
      .optional(),
    check("max").trim().isInt().toInt().optional(),
    check("author").trim().isString().isLength({ min: 1 }).optional(),
    checkValidate,
    authenticateOptional,
  ],
  postsController.getPosts
);

/**
 * @api {post} /api/posts/ Write a Post
 * @apiName WritePost
 * @apiGroup Post
 *
 * @apiUse autorization_form_data
 * @apiPermission registered
 *
 * @apiParam {String{1..}} title Title of the Post.
 * @apiParam {String{3..}} text Post Text.
 * @apiParam {Image} image An Image File to be in the Post.
 *
 * @apiUse apiSuccess_success
 * @apiSuccess {Object[]} result Created Post.
 * @apiUse apiSuccess_PostAsResult_Authorobject
 * @apiSuccess {Object[]} result.comments Array of Comments.
 * @apiSuccess {String} result.comments.id <code>id</code> of the Comment.
 * @apiSuccess {String} result.comments.author Author of the Comment.
 * @apiSuccess {String} result.comments.author._id ID of Author of the Comment.
 * @apiSuccess {String} result.comments.author.username Username of Author of the Comment.
 * @apiSuccess {String} result.comments.text Comment Text.
 * @apiSuccess {Date} result.comments.date Creation Date of the Comment.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "result": {
 *          "_id": "10A46...",
 *          "title": "Post Title",
 *          "text": "some text.",
 *          "author": {
 *            "_id": "5fda15344d46c345a00306ce",
 *            "username": "john"
 *          },
 *          "postDate": "15.12.2020 15:25:56",
 *          "image": "true",
 *          "comments": [
 *            {
 *              "_id": "HGTZJN5663",
 *              "author": {
 *                "_id": "5fda15344d46c345a00306ce",
 *                "username": "john"
 *              },
 *              "text": "nice Post",
 *              "date": "15.12.2020 15:35:56"
 *            }
 *          ]
 *       }
 *     }
 *
 * @apiUse ErrorID
 * @apiUse ErrorUnauthorized
 * @apiUse ErrorPrivacy
 * @apiUse Error500
 */
router.post(
  "/",
  [
    upload.single("image"),
    //check("title").trim().isString().isLength({ min: 1 }),
    //check("text").trim().isString().isLength({ min: 3 }),
    passport.authenticate("jwt", { session: false }),
  ],
  postsController.writePost
);

/**
 * @api {get} /api/posts/:id Get one Post
 * @apiName GetPost
 * @apiGroup Post
 *
 * @apiUse autorization_optional
 *
 * @apiParam {Number} id Posts unique ID.
 * @apiParam {Boolean} onlyComments Return only the Comments of the Post. (optional) <br/> Use: if Post already known because of getPosts
 *
 * @apiUse apiSuccess_success
 * @apiSuccess {Object[]} result Array of Posts.
 * @apiUse apiSuccess_PostAsResult_Authorobject
 * @apiSuccess {Object[]} result.comments Array of Comments.
 * @apiSuccess {String} result.comments.id <code>id</code> of the Comment.
 * @apiSuccess {String} result.comments.author Author of the Comment.
 * @apiSuccess {String} result.comments.author._id ID of Author of the Comment.
 * @apiSuccess {String} result.comments.author.username Username of Author of the Comment.
 * @apiSuccess {String} result.comments.text Comment Text.
 * @apiSuccess {Date} result.comments.date Creation Date of the Comment.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "result": {
 *          "_id": "10A46...",
 *          "title": "Post Title",
 *          "text": "some text.",
 *          "author": {
 *            "_id": "5fda15344d46c345a00306ce",
 *            "username": "john"
 *          },
 *          "postDate": "15.12.2020 15:25:56",
 *          "image": "true",
 *          "comments": [
 *            {
 *              "_id": "HGTZJN5663",
 *              "author": {
 *                "_id": "5fda15344d46c345a00306ce",
 *                "username": "john"
 *              },
 *              "text": "nice Post",
 *              "date": "15.12.2020 15:35:56"
 *            }
 *          ]
 *        }
 *     }
 *
 * @apiUse ErrorID
 * @apiUse ErrorPrivacy
 * @apiUse ErrorParams
 * @apiUse Error500
 */
router.get(
  "/:id",
  [
    check("onlyComments").trim().isBoolean().toBoolean().optional(),
    checkValidate,
    authenticateOptional,
    checkID,
    postsController.MW_getPostByID,
    usersController.MW_checkPrivacyForPost,
  ],
  postsController.getPost
);

/**
 * @api {get} /api/posts/:id/image Get Image from Post
 * @apiName GetPostImage
 * @apiGroup Post
 *
 * @apiHeader (Optional Headers) {String} Authorization Authorization via JWT. <br/> Also possible as Cookie. The Cookie needs to be <code>jwt</code> and needs to be in the format: <br/> <code>JWT Ahjdkjsdjiw...</code>
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "JWT Ahjdkjsdjiw..."
 *     }
 *
 * @apiParam {Number} id Posts unique ID.
 * @apiParam {String="normal","small"} Size of the Image.
 *
 * @apiSuccessExample {binary} Success-Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: 'image/png'
 *     Content-Length: '1400'
 *
 * @apiUse ErrorID
 * @apiUse ErrorPrivacy
 * @apiUse ErrorParams
 * @apiUse Error500
 */
router.get(
  "/:id/image",
  [
    check("size").trim().isIn(["normal", "small"]).optional(),
    checkValidate,
    authenticateOptional,
    checkID,
    postsController.MW_getPostByID,
    usersController.MW_checkPrivacyForPost,
  ],
  postsController.getImage
);

/**
 * @api {post} /api/posts/:id/comment Write a Comment
 * @apiName WriteComment
 * @apiGroup Post
 *
 * @apiUse autorization
 * @apiPermission registered
 *
 * @apiParam {Number} id Posts unique ID.
 * @apiParam {String} text Comment text.
 *
 * @apiUse apiSuccess_success
 * @apiSuccess {Object} result The Comment.
 * @apiSuccess {String} result.id <code>id</code> of the Comment.
 * @apiSuccess {String} result.author ID of the Author of the Comment.
 * @apiSuccess {String} result.text Comment Text.
 * @apiSuccess {Date} result.date Creation Date of the Comment.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "result": [
 *          {
 *            "_id": "2HHIKKL",
 *            "author": "20A47",
 *            "text": "nice Post",
 *            "date": "15.12.2020 15:35:56"
 *          }
 *       ]
 *     }
 *
 * @apiUse ErrorID
 * @apiUse ErrorUnauthorized
 * @apiUse ErrorPrivacy
 * @apiUse Error500
 */
router.post(
  "/:id/comment",
  [
    passport.authenticate("jwt", { session: false }),
    checkID,
    postsController.MW_getPostByID,
    usersController.MW_checkPrivacyForPost,
    check("text").trim().isString().isLength({ min: 1 }),
    checkValidate,
  ],
  postsController.writeComment
);

//404
router.get("*", (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
