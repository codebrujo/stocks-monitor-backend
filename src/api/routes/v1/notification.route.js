const express = require('express');
const controller = require('../../controllers/notification.controller');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    /**
     * @api {get} v1/notifications                    Notifications List
     * @apiDescription Get a list of user's notifications
     * @apiVersion 1.0.0
     * @apiName NotificationsList
     * @apiGroup Notifications
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiSuccess {Object[]} notification            List of Notifications.
     *
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can access the data
     */
    .get(authorize(LOGGED_USER), controller.list)
    /**
     * @api {post} v1/notifications                   Add new notification
     * @apiDescription Add new notification
     * @apiVersion 1.0.0
     * @apiName AddNotification
     * @apiGroup Notifications
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiParam {String}  ticker                     Notification ticker
     * @apiParam {Number}  highPrice                  Max value to set
     * @apiParam {Number}  lowPrice                   Min value to set
     *
     * @apiSuccess (Created 201) {String}  ticker     Notification id
     * @apiSuccess (Created 201) {Number}  highPrice  Max value of ticker price
     * @apiSuccess (Created 201) {Number}  lowPrice   Min value of ticker price
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
     * @apiError (Not Found 404)     NotFound         Requested ticker is not found in reference data
     *
     */
    .post(authorize(LOGGED_USER), controller.add);


router
    .route('/:ticker')
    /**
     * @api {get} v1/notifications/:ticker           Get notification details
     * @apiDescription Get notification details
     * @apiVersion 1.0.0
     * @apiName GetNotification
     * @apiGroup Notifications
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiSuccess {String}  ticker                   Notification ticker
     * @apiSuccess (Created 201) {Number}  highPrice  Max value of ticker price
     * @apiSuccess (Created 201) {Number}  lowPrice   Min value of ticker price
     *
     * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden         Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound          Item does not exist
     */
    .get(authorize(LOGGED_USER), controller.get)
    /**
     * @api {patch} v1/notifications/:ticker          Modify Notification
     * @apiDescription Modify Notification details
     * @apiVersion 1.0.0
     * @apiName UpdateNotification
     * @apiGroup Notifications
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiParam {String}  ticker                     Notification ticker
     * @apiParam {Number}  highPrice                  Max value to set
     * @apiParam {Number}  lowPrice                   Min value to set
     *
     * @apiSuccess {String}  ticker                   Notification ticker
     * @apiSuccess {Number}  highPrice  New max value of ticker price
     * @apiSuccess {Number}  lowPrice   New min value of ticker price
     *
     * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can modify the data
     * @apiError (Not Found 404)    NotFound          Item does not exist
     */
    .patch(authorize(LOGGED_USER), controller.update)
    /**
     * @api {delete} v1/notifications/:notificationId Replace Notification
     * @apiDescription Replace existing Notification
     * @apiVersion 1.0.0
     * @apiName ReplaceNotification
     * @apiGroup Notifications
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiSuccess (No Content 204)                   Successfully deleted
     *
     * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can modify the data
     * @apiError (Not Found 404)    NotFound          Item does not exist
     */
    .delete(authorize(LOGGED_USER), controller.remove);

/*global module*/
/*eslint no-undef: ["error", { "typeof": true }] */
module.exports = router;