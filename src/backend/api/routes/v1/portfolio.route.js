const express = require('express');
const controller = require('../../controllers/portfolio.controller');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/history')
    /**
     * @api {get} v1/portfolio/history                Returns historical cost
     * @apiDescription Returns historical cost of whole portfolio
     * @apiVersion 1.0.0
     * @apiName PortfolioList
     * @apiGroup Portfolio
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiSuccess {Object[]}        historyObject    Object with data[] and label[] fields.
     *
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can access the data
     */
    .get(authorize(LOGGED_USER), controller.getHistory);

router
    .route('/summary')
    /**
     * @api {get} v1/portfolio/history                Returns historical cost
     * @apiDescription Returns historical cost of whole portfolio
     * @apiVersion 1.0.0
     * @apiName PortfolioList
     * @apiGroup Portfolio
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiSuccess {Object[]}        summaryObject    Object with calculated summary
     *
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can access the data
     */
    .get(authorize(LOGGED_USER), controller.getSummary);


router
    .route('/')
    /**
     * @api {get} v1/portfolio                        Portfolio List
     * @apiDescription Get a list of portfolio items
     * @apiVersion 1.0.0
     * @apiName PortfolioList
     * @apiGroup Portfolio
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiSuccess {Object[]} portfolioItems          List of portfolio items.
     *
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can access the data
     */
    .get(authorize(LOGGED_USER), controller.list)
    /**
     * @api {post} v1/portfolio                       Add new item to Portfolio List
     * @apiDescription Add new item to Portfolio List
     * @apiVersion 1.0.0
     * @apiName AddPortfolioItem
     * @apiGroup Portfolio
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiParam  {String}   ticker                   Ticker
     * @apiParam  {String}   purchaseDate             Purchase date
     * @apiParam  {Number}   price                    Purchase price
     * @apiParam  {Number}   quantity                 Purchased quantity
     *
     * @apiSuccess (Created 201) {String}  ticker           Item's ticker
     * @apiSuccess (Created 201) {String}  purchaseDate     Last purchase date
     * @apiSuccess (Created 201) {Number}  currentPrice     Current price for one item
     * @apiSuccess (Created 201) {String}  link             Link to information page of the item
     * @apiSuccess (Created 201) {Number}  price            Average purchase price of the item
     * @apiSuccess (Created 201) {Number}  quantity         Item's quantity
     * @apiSuccess (Created 201) {Number}  multiplier       Item's multiplier
     * @apiSuccess (Created 201) {Boolean}  notification    Notification indicator for the item
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
     * @api {get} v1/portfolio/:ticker                Get Portfolio item details
     * @apiDescription Get Portfolio Item details
     * @apiVersion 1.0.0
     * @apiName GetPortfolioItem
     * @apiGroup Portfolio
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiParam  {Object}   chartParams              Parameters to calculate chartData
     *
     * @apiSuccess {Object}  PortfolioItem            Item details object
     *
     * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can access the data
     * @apiError (Not Found 404)    NotFound          Item does not exist
     */
    .get(authorize(LOGGED_USER), controller.get)
    /**
     * @api {delete} v1/portfolio/:ticker             Replace Item
     * @apiDescription Replace stock item from User's Portfolio
     * @apiVersion 1.0.0
     * @apiName ReplacePortfolioItem
     * @apiGroup Portfolio
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