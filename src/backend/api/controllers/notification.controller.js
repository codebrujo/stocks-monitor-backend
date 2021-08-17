const httpStatus = require('http-status');
const logger = require('../../config/logger');

const db = require('../models');
const { Stock, Notification, Sequelize } = db;
const { eq } = Sequelize.Op;

/**
 * Returns list of user's notifications
 * @public
 */
exports.list = async(req, res, next) => {
    const { user } = req;
    Notification.findAll({
            attributes: [
                'highPrice', 'lowPrice'
            ],
            where: {
                UserId: {
                    [eq]: user.id
                }
            },
            include: [{
                attributes: [
                    'ticker'
                ],
                model: Stock,
                required: true,
            }, ],
        }).then((recordset) => {
            const arr = recordset.map((item) => {
                const stockObj = item.Stock;
                const { highPrice, lowPrice } = item;
                return ({
                    ticker: stockObj.ticker,
                    highPrice: parseFloat(highPrice),
                    lowPrice: parseFloat(lowPrice),
                });
            });
            res.status(httpStatus.OK);
            res.json(arr);
        })
        .catch((e) => {
            logger.error(e);
            return (next(e));
        });

};

/**
 * Add a new notification
 * @public
 */
exports.add = async(req, res, next) => {
    const { user } = req;
    console.log('[notification.controller]: add', req.body);
    let resBody = {};
    let resHttpStatus = httpStatus.BAD_REQUEST;
    const stock = await Stock.findByTicker(req.body.ticker, user);
    if (!stock) {
        resHttpStatus = httpStatus.NOT_FOUND;
        resBody = {
            message: 'Reference does not contain the requested ticker',
            request: req.body
        };
    } else {
        const newItem = await Notification.addItem(req.body, user, stock);
        if (!newItem) {
            resHttpStatus = httpStatus.INTERNAL_SERVER_ERROR;
        } else {
            resHttpStatus = httpStatus.CREATED;
            resBody = {
                ticker: stock.ticker,
                highPrice: parseFloat(newItem.highPrice),
                lowPrice: parseFloat(newItem.lowPrice),
            };
        }
    }
    res.status(resHttpStatus);
    res.json(resBody);
};

/**
 * Returns single requested notification
 * @public
 */
exports.get = async(req, res, next) => {
    const { user } = req;
    const item = await Notification.findByTicker(req.params.ticker, user);
    if (item) {
        res.status(httpStatus.OK);
        res.json({
            ticker: item.Stock.ticker,
            highPrice: parseFloat(item.highPrice),
            lowPrice: parseFloat(item.lowPrice),
        });
    } else {
        res.status(httpStatus.NOT_FOUND);
        res.json(null);
    }
};

/**
 * Update existing notification
 * @public
 */
exports.update = async(req, res, next) => {
    const { user } = req;
    const { highPrice, lowPrice } = req.body;
    const item = await Notification.findByTicker(req.params.ticker, user);
    if (item) {
        item.highPrice = highPrice;
        item.lowPrice = lowPrice;
        await item.save();
        res.status(httpStatus.OK);
        res.json({
            ticker: item.Stock.ticker,
            highPrice: parseFloat(item.highPrice),
            lowPrice: parseFloat(item.lowPrice),
        });
    } else {
        res.status(httpStatus.NOT_FOUND);
        res.json(null);
    }
};

/**
 * Remove particular notification
 * @public
 */
exports.remove = async(req, res, next) => {
    const { user } = req;
    const item = await Notification.findByTicker(req.params.ticker, user);
    if (item) {
        await item.destroy();
        res.status(httpStatus.NO_CONTENT);
    } else {
        res.status(httpStatus.NOT_FOUND);
    }
    res.json(null);
};