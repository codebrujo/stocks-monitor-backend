const { Joi } = require('express-validation');

module.exports = {

    // GET v1/stocks/:ticker/price/change
    stockDetails: {
        query: Joi.object({
            period: Joi.string().required(),
        }),
        params: Joi.object({
            ticker: Joi.string().regex(/^[0-9a-zA-Z]*$/).required(),
        }),
    },

    // GET v1/stocks/:ticker/company
    getCompany: {
        params: Joi.object({
            ticker: Joi.string().regex(/^[0-9a-zA-Z]*$/).required(),
        }),
    },

    // GET v1/stocks/:ticker/price
    getPriceOnDate: {
        query: Joi.object({
            date: Joi.string().required(),
        }),
        params: Joi.object({
            ticker: Joi.string().regex(/^[0-9a-zA-Z]*$/).required(),
        }),
    },

};