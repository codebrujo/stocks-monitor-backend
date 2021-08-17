const express = require('express');
const { validate } = require('express-validation');
const controller = require('../../controllers/stock.controller');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');
const {
    stockDetails,
    getCompany,
    getPriceOnDate,
} = require('../../validations/stock.validation');

const router = express.Router();

/**
 * Load stock when API with ticker route parameter is hit
 */
router.param('ticker', controller.load);


router
    .route('/')
    /**
     * @api {get} v1/stocks List Stocks
     * @apiDescription Get a list of available stocks
     * @apiVersion 1.0.0
     * @apiName ListStocks
     * @apiGroup Stocks
     * @apiPermission user
     */
    .get(authorize(LOGGED_USER), controller.list);

router
    .route('/:ticker/company')
    /**
     * @api {get} v1/stocks/:ticker/company           Returns company information by ticker
     * @apiDescription Get company details by ticker
     * @apiVersion 1.0.0
     * @apiName GetCompany
     * @apiGroup Stocks
     * @apiPermission user
     *
     * @apiHeader {String} Authorization              User's access token
     *
     * @apiSuccess {Object}  company                  Company object
     *
     * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can access the data
     * @apiError (Not Found 404)    NotFound          Ticker does not exist
     */
    .get(authorize(LOGGED_USER), validate(getCompany), controller.getCompany);

router
    .route('/:ticker/price/change')
    /**
     * @api {get} v1/stocks/:ticker/price/change      Returns ticker's price change
     * @apiDescription Returns ticker's price change object
     * @apiVersion 1.0.0
     * @apiName GetPriceChange
     * @apiGroup Stocks
     * @apiPermission user
     *
     * @apiHeader {String}      Authorization            User's access token
     *
     * @apiSuccess {Object}     priceChanges             Price changes object ('data' and 'labels' arrays)
     *
     * @apiError (Unauthorized 401) Unauthorized         Only authenticated users can access the data
     * @apiError (Not Found 404)    NotFound             Ticker does not exist
     */
    .get(authorize(LOGGED_USER), validate(stockDetails), controller.getPriceChange);

router
    .route('/:ticker/price/values')
    /**
     * @api {get} v1/stocks/:ticker/price/change      Returns ticker's prices
     * @apiDescription Returns ticker's prices for the requested period
     * @apiVersion 1.0.0
     * @apiName GetPrice
     * @apiGroup Stocks
     * @apiPermission user
     *
     * @apiHeader {String}      Authorization            User's access token
     *
     * @apiSuccess {Object}     prices                   Price changes object ('data' and 'labels' arrays)
     *
     * @apiError (Unauthorized 401) Unauthorized         Only authenticated users can access the data
     * @apiError (Not Found 404)    NotFound             Ticker does not exist
     */
    .get(authorize(LOGGED_USER), validate(stockDetails), controller.getPrice);

router
    .route('/:ticker/price')
    /**
     * @api {get} v1/stocks/:ticker/price/change      Returns ticker's price
     * @apiDescription Returns ticker's price on the requested date
     * @apiVersion 1.0.0
     * @apiName GetPrice
     * @apiGroup Stocks
     * @apiPermission user
     *
     * @apiHeader {String}      Authorization            User's access token
     *
     * @apiSuccess {Object}     prices                   Price changes object ('data' and 'labels' arrays)
     *
     * @apiError (Unauthorized 401) Unauthorized         Only authenticated users can access the data
     * @apiError (Not Found 404)    NotFound             Ticker does not exist
     */
    .get(authorize(LOGGED_USER), validate(getPriceOnDate), controller.getPriceOnDate);

module.exports = router;