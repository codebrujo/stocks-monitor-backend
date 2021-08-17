const httpStatus = require('http-status');
const moment = require('moment');
const db = require('../../models');

const { Stock, Company, Notification, Sequelize } = db;
const logger = require('../../config/logger');
const { getPrecision } = require('../../utils/helpers');
const { eq } = Sequelize.Op;

/**
 * Load stock and append to req.
 * @public
 */
exports.load = async(req, res, next, ticker) => {
    try {
        const stock = await Stock.findOne({ where: { ticker } });
        if (!stock) {
            const e = new Error('Stock does not exist');
            e.status = httpStatus.NOT_FOUND;
            next(e);
        } else {
            req.locals = { stock };
            next();
        }
    } catch (e) { next(e); }
};

/**
 * Returns stock list
 * @public
 *
 * @returns { Stock[] }
 **/
exports.list = async(req, res, next) => {
    const { user } = req;
    try {
        const recordset = await Stock.findAll({
            attributes: [
                'ticker', 'currency', 'ratio', 'price', 'multiplier'
            ],
            include: [{
                    attributes: [
                        'name', 'cap', 'link'
                    ],
                    model: Company,
                    required: true,
                },
                {
                    attributes: [
                        'highPrice', 'lowPrice'
                    ],
                    where: {
                        UserId: {
                            [eq]: user.id
                        }
                    },
                    model: Notification,
                    required: false,
                }
            ],
            order: [
                ['ratio', 'DESC']
            ]
        });
        if (recordset) {
            let stocks = recordset.map((item) => {
                const companyObj = item.Company;
                const { ticker, currency, ratio, price, multiplier, Notifications } = item;
                return ({
                    company: companyObj.name,
                    ticker,
                    cap: parseFloat(companyObj.cap),
                    currency,
                    ratio: parseFloat(ratio),
                    price: parseFloat(price),
                    multiplier,
                    notification: Boolean(Notifications.length)
                });
            });
            res.status(httpStatus.OK);
            res.json(stocks);
        } else {
            res.status(httpStatus.NOT_FOUND);
            next();
        }
    } catch (e) {
        logger.error(e);
        next(e);
    }
};


const getAnalytics = async(stock, period) => {
    if (!stock) { return []; }
    let chartData = [];
    let labelFormat = 'MMM, D';
    switch (period) {
        case 'week':
            chartData = await stock.getWeekAgregates();
            break;
        case 'month':
            chartData = await stock.getMonthAgregates(moment());
            break;
        case '6months':
            chartData = await stock.getHalfYearAgregates(moment());
            break;
        case 'year':
            labelFormat = 'MMM';
            chartData = await stock.getYearAgregates(moment());
            break;
        default:
            return [];
    }
    chartData = chartData.map((item) => {
        return ({
            date: moment(item.date).format('YYYY-MM-DD'),
            label: moment(item.date).format(labelFormat),
            openValue: +parseFloat(item.openValue).toFixed(4),
            maxValue: +parseFloat(item.maxValue).toFixed(4),
            minValue: +parseFloat(item.minValue).toFixed(4),
            closeValue: +parseFloat(item.closeValue).toFixed(4),
            volume: +parseFloat(item.volume).toFixed(4)
        });
    });
    chartData.reverse();
    return chartData;
};

exports.getPriceChange = async(req, res, next) => {
    const { period } = req.query;
    const { stock } = req.locals;
    let data = [],
        labels = [];
    const chartData = await getAnalytics(stock, period);
    const precision = chartData.reduce((val, current) => {
        return Math.max(val, getPrecision(current.closeValue));
    }, 0);
    let avr = chartData.reduce((val, current) => {
        return val + current.closeValue;
    }, 0);
    if (chartData.length) {
        avr = +(avr / chartData.length).toFixed(precision);
    } else {
        avr = 0;
    }
    data = chartData.map(item => {
        return +(item.closeValue - avr).toFixed(precision);
    });
    labels = chartData.map(item => item.label);
    res.json({ data, labels, precision });
};

exports.getPrice = async(req, res, next) => {
    const { period } = req.query;
    const { stock } = req.locals;
    let data = [],
        labels = [];
    const chartData = await getAnalytics(stock, period);
    data = chartData.map(item => item.closeValue);
    labels = chartData.map(item => item.label);
    res.json({ data, labels });
};

exports.getPriceOnDate = async(req, res, next) => {
    const { stock } = req.locals;
    const { date } = req.query;
    try {
        const price = await stock.getPriceOnDate(date);
        res.json(price);
    } catch (error) {
        next(error);
    }
};


exports.getCompany = async(req, res, next) => {
    const { ticker } = req.params;
    const recordset = await Stock.findOne({
        attributes: ['id'],
        where: {
            ticker: ticker
        },
        include: [{
            model: Company,
            required: true,
        }, ],

    });
    if (recordset) {
        res.json(recordset.Company);
    } else {
        res.status(httpStatus.NOT_FOUND);
        next();
    }

};