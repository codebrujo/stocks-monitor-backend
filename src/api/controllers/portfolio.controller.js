const httpStatus = require('http-status');
const db = require('../../models');
const moment = require('moment');

const {
    Stock,
    Company,
    Notification,
    PortfolioItem,
    Sequelize,
    CurrencyRate,
    PortfolioMovement,
    PortfolioDetail,
} = db;
const { eq } = Sequelize.Op;

/**
 * Compose abd returns object with portfolio summary information
 * @private
 */
const composeSummary = async() => {
    const summary = {
        value: 0,
        gains: 0,
        dayChange: 0,
        rate: 1,
    };
    summary.value = await PortfolioItem.getTotalValue(user);
    const summaryCost = await PortfolioItem.getTotalInitialValue(user);
    summary.gains = +((await PortfolioMovement.getTotalGains(user)) + summaryCost).toFixed(2);
    const prevDateValue = await PortfolioDetail.get(user, moment().add(-1, 'd'));
    summary.dayChange = summary.value - prevDateValue;
    summary.rate = await CurrencyRate.getRateByCharCode();
    return summary;
};

/**
 * Returns summary information of the portfolio
 * @public
 */
exports.getSummary = async(req, res, next) => {
    const { user } = req;
    try {
        const summary = await composeSummary(user);
        res.status(httpStatus.OK);
        res.json(summary);
    } catch (error) {
        next(error);
    }
};

/**
 * Returns portfolio items list
 * @public
 */
exports.list = async(req, res, next) => {
    const { user } = req;
    try {
        const recordset = await PortfolioItem.findAll({
            attributes: [
                'purchaseDate', 'price', 'quantity'
            ],
            where: {
                UserId: {
                    [eq]: user.id
                }
            },
            include: [{
                attributes: [
                    'ticker', 'price', 'link', 'multiplier'
                ],
                model: Stock,
                required: true,
                include: [{
                    attributes: [
                        'id'
                    ],
                    where: {
                        UserId: {
                            [eq]: user.id
                        }
                    },
                    model: Notification,
                    required: false,
                }]
            }, ],
        });
        let stocks = recordset.map((item) => {
            const stockObj = item.Stock;
            const { purchaseDate, price, quantity } = item;
            return ({
                ticker: stockObj.ticker,
                purchaseDate: moment(purchaseDate).format('YYYY-MM-DD'),
                currentPrice: parseFloat(stockObj.price),
                link: stockObj.link,
                price: parseFloat(price),
                quantity: parseInt(quantity, 10),
                multiplier: parseInt(stockObj.multiplier, 10),
                notification: Boolean(stockObj.Notifications.length)
            });
        });
        const summary = await composeSummary(user);
        res.status(httpStatus.OK);
        res.json({ entities: stocks, summary });
    } catch (error) {
        next(error);
    }
};

/**
 * Add new item into portfolio list
 * @public
 */
exports.add = async(req, res, next) => {
    console.log('[portfolio.controller]: add', req.body);
    const { user } = req;
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
        const newTicker = await PortfolioItem.addItem(req.body, user, stock);
        if (!newTicker) {
            resHttpStatus = httpStatus.INTERNAL_SERVER_ERROR;
        } else {
            resHttpStatus = httpStatus.CREATED;
            resBody = {
                ticker: stock.ticker,
                purchaseDate: moment(newTicker.purchaseDate).format('YYYY-MM-DD'),
                currentPrice: parseFloat(stock.price),
                link: stock.link,
                price: parseFloat(newTicker.price),
                quantity: parseInt(newTicker.quantity, 10),
                multiplier: parseInt(stock.multiplier, 10),
                notification: Boolean(stock.Notifications.length)
            };
        }
    }
    res.status(resHttpStatus);
    res.json(resBody);
};

/**
 * Remove item from portfolio list
 * @public
 */
exports.remove = async(req, res, next) => {
    const { user } = req;
    let resBody = {
        result: 'error',
        message: 'Reference does not contain the ticker to be deleted',
        request: req.params.ticker
    };
    let resHttpStatus = httpStatus.BAD_REQUEST;
    const stock = await Stock.findByTicker(req.params.ticker, user);
    if (!stock) {
        resHttpStatus = httpStatus.NOT_FOUND;
    } else {
        resBody = await PortfolioItem.decreaseItem(req.body, user, stock);
        switch (resBody.result) {
            case 'error':
                resHttpStatus = httpStatus.INTERNAL_SERVER_ERROR;
                break;
            case 'NOT FOUND':
                resHttpStatus = httpStatus.NOT_FOUND;
                break;
            case 'success':
                resHttpStatus = httpStatus.NO_CONTENT;
                break;
            default:
                resHttpStatus = httpStatus.BAD_REQUEST;
        }
    }
    res.status(resHttpStatus);
    res.json(resBody);
};

/**
 * Returns historical recordset related to requested period
 * @private
 */
const getAnalytics = async(user, period) => {
    let chartData = [];
    let labelFormat = 'MMM, D';
    switch (period) {
        case 'week':
            chartData = await PortfolioDetail.getWeekAgregates(user);
            break;
        case 'month':
            chartData = await PortfolioDetail.getMonthAgregates(user, moment());
            break;
        case '6months':
            chartData = await PortfolioDetail.getHalfYearAgregates(user, moment());
            break;
        case 'year':
            labelFormat = 'MMM';
            chartData = await PortfolioDetail.getYearAgregates(user, moment());
            break;
        default:
            return [];
    }
    chartData = chartData.map((item) => {
        return ({
            date: moment(item.date).format('YYYY-MM-DD'),
            label: moment(item.date).format(labelFormat),
            value: +parseFloat(item.value).toFixed(4),
        });
    });
    chartData.reverse();
    return chartData;
};

/**
 * Returns historical cost records of the portfolio
 * @public
 */
exports.getHistory = async(req, res, next) => {
    const { user } = req;
    const { period } = req.query;
    try {
        const chartData = await getAnalytics(user, period);
        data = chartData.map(item => item.value);
        labels = chartData.map(item => item.label);
        res.json({ data, labels });
    } catch (error) {
        next(error);
    }
};

/**
 * Returns requested portfolio item
 * @public
 */
exports.get = async(req, res, next) => {
    const { user } = req;
    const { ticker } = req.params;
    PortfolioItem.findOne({
            attributes: [
                'id', 'purchaseDate', 'price', 'quantity', 'createdAt', 'updatedAt'
            ],
            where: {
                UserId: user.id
            },
            include: [{
                attributes: [
                    'id', 'ticker', 'currency', 'ratio', 'price', 'multiplier', 'link'
                ],
                where: { ticker },
                model: Stock,
                required: true,
                include: [{
                    attributes: [
                        'id', 'highPrice', 'lowPrice', 'createdAt', 'updatedAt'
                    ],
                    where: {
                        UserId: user.id
                    },
                    model: Notification,
                    required: false,
                }, {
                    model: Company,
                    required: true,
                }]
            }, ],
        }).then((portfolioItem) => {
            if (!portfolioItem) {
                const e = new Error('Item is not found');
                e.status = httpStatus.NOT_FOUND;
                return next(e);
            }
            res.json(portfolioItem);
        })
        .catch((e) => next(e));
};