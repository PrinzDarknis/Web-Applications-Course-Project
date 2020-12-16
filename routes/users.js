const express = require("express");
const { check } = require("express-validator");
const passport = require("passport");

const usersController = require("../controller/users");
const {
  checkValidate,
  checkID,
  authenticateOptional,
} = require("../middleware");

/**
 * @apiDefine Error404
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * @apiErrorExample {json} UserNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "msg": "Cannot find User"
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
 * @apiDefine ErrorUsernameTaken
 * @apiError UsernameTaken The Username is already taken.
 * @apiErrorExample {json} UsernameTaken:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "success": false,
 *       "msg": "Username is taken"
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
 * @apiDefine apiSuccess_UserAsResult
 * @apiSuccess {Object} result The User Object.
 * @apiSuccess {String} result.id ID of the User.
 * @apiSuccess {String} result.name  Name of the User.
 * @apiSuccess {String} result.username  Username of the User.
 * @apiSuccess {String} result.email  E-Mail adress of the User.
 * @apiSuccess {String="everyone", "registered", "friends", "private"} result.privacy  Privacy configuration of the User.
 * @apiSuccess {String[]} result.friends  List of IDs of Friends.
 * @apiSuccess {String[]} result.friendsAsked  List of IDs of people who want to be Friends.
 */

const router = express.Router();

/**
 * @api {post} /api/users/register Register New User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String{3..}} username User who want to login.
 * @apiParam {String{3..}} password Password of the User.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username": "john",
 *        "password": "123456"
 *     }
 *
 * @apiUse apiSuccess_success
 * @apiSuccess {String} msg <code>"User registered"</code>
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "msg": "User registered"
 *     }
 *
 * @apiUse ErrorParams
 * @apiUse ErrorUsernameTaken
 * @apiUse Error500
 */
router.post(
  "/register",
  [
    check("username", "min. length 3").trim().isString().isLength({ min: 3 }),
    check("password", "min. length 3").trim().isString().isLength({ min: 3 }),
    checkValidate,
  ],
  usersController.register
);

/**
 * @api {post} /api/users/authenticate Get JWT
 * @apiName AuthenticateUser
 * @apiGroup User
 *
 * @apiParam {String{1..}} username User who want to login.
 * @apiParam {String{1..}} password Password of the User.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username": "john",
 *        "password": "123456"
 *     }
 *
 * @apiUse apiSuccess_success
 * @apiSuccess {String} token  The JWt to use for authentification.
 * @apiUse apiSuccess_UserAsResult
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "token": "JWT AHHI456468463...",
 *       "result": {
 *          "id": "10A46",
 *          "name": "John Doe",
 *          "username": "John_Doe",
 *          "email": "John@Doe.de",
 *          "privacy": "everyone",
 *          "friends": [ "Max" ],
 *          "friendsAsked": [ "Maria", "Yui" ]
 *       }
 *     }
 *
 * @apiUse ErrorParams
 * @apiError WrongCredentials Username or Password is wrong
 * @apiErrorExample {json} WrongCredentials:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "success": false,
 *       "msg": "Wrong Username or Password"
 *     }
 * @apiUse Error500
 */
router.post(
  "/authenticate",
  [
    check("username", "needs Username").trim().isString().isLength({ min: 1 }),
    check("password", "needs Password").trim().isString().isLength({ min: 1 }),
    checkValidate,
  ],
  usersController.authenticate
);

/**
 * @api {get} /api/users/:id Request User Information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiHeader (Optional Headers) {String} Authorization Authorization via JWT.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "JWT Ahjdkjsdjiw..."
 *     }
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiUse apiSuccess_success
 * @apiUse apiSuccess_UserAsResult
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "result": {
 *          "id": "10A46",
 *          "name": "John Doe",
 *          "username": "John_Doe"
 *       }
 *     }
 *
 * @apiSuccessExample {json} Success-Response Friend:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "result": {
 *          "id": "10A46",
 *          "name": "John Doe",
 *          "username": "John_Doe",
 *          "email": "John@Doe.de",
 *          "privacy": "everyone",
 *          "friends": [ "Max" ],
 *          "friendsAsked": [ "Maria", "Yui" ]
 *       }
 *     }
 *
 * @apiUse Error404
 * @apiUse ErrorID
 * @apiUse Error500
 */
router.get(
  "/:id",
  [checkID, usersController.MW_getUserByID, authenticateOptional],
  usersController.profile
);

/**
 * @api {post} /api/users/:id Change User Data
 * @apiName ChangeUser
 * @apiGroup User
 *
 * @apiParam {String{3..}} username new Username.
 * @apiParam {String{3..}} password new Password.
 * @apiParam {String="everyone", "registered", "friends", "private"} privacy  new Privacy configuration.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username": "john",
 *        "password": "123456"
 *     }
 *
 * @apiUse apiSuccess_success
 * @apiUse apiSuccess_UserAsResult
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "result": {
 *          "id": "10A46",
 *          "name": "John Doe",
 *          "username": "John_Doe",
 *          "email": "John@Doe.de",
 *          "privacy": "everyone",
 *          "friends": [ "Max" ],
 *          "friendsAsked": [ "Maria", "Yui" ]
 *       }
 *     }
 *
 * @apiUse ErrorParams
 * @apiUse ErrorUnauthorized
 * @apiUse ErrorUsernameTaken
 * @apiUse Error500
 */
router.post(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkID,
    usersController.MW_getUserByID,
    check("username", "min. length 3")
      .trim()
      .isString()
      .isLength({ min: 3 })
      .optional(),
    check("password", "min. length 3")
      .trim()
      .isString()
      .isLength({ min: 3 })
      .optional(),
    check(
      "privacy",
      'invalide Value, allowed: "everyone", "registered", "friends" or "private"'
    )
      .trim()
      .isIn(["everyone", "registered", "friends", "private"])
      .optional(),
    checkValidate,
  ],
  usersController.changeUser
);

/**
 * @api {post} /api/users/:id/askFriend Ask for Friendship
 * @apiName BefriendUser
 * @apiGroup User
 *
 * @apiHeader (Headers) {String} Authorization Authorization via JWT.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "JWT Ahjdkjsdjiw..."
 *     }
 *
 * @apiUse apiSuccess_success
 * @apiSuccess {String="friend","asked"} state State of the request.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "state": "asked"
 *     }
 *
 * @apiUse ErrorUnauthorized
 * @apiUse ErrorID
 * @apiUse Error404
 * @apiUse Error500
 */
router.post(
  "/:id/askFriend",
  [
    passport.authenticate("jwt", { session: false }),
    checkID,
    usersController.MW_getUserByID,
  ],
  usersController.askFriend
);

module.exports = router;
