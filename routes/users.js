const express = require("express");
const { check } = require("express-validator");
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
 * @apiUse apiSuccess_UserAsResult
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "msg": "User registered"
 *     }
 *
 * @apiUse ErrorParams
 * @apiError UsernameTaken The Username is already taken.
 * @apiErrorExample {json} UsernameTaken:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "success": false,
 *       "msg": "Username is taken"
 *     }
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
 * @apiSuccessExample Success-Response:
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
 * @apiSuccessExample Success-Response:
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
 * @apiSuccessExample Success-Response Friend:
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

module.exports = router;
