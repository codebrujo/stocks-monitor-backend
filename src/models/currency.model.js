const moment = require('moment');
/**
 * Currency Schema
 */
module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define('Currency', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        charCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
    });

    Currency.getCurrenciesWithRates = async(requestedDate) => {
        const { CurrencyRate } = Currency.sequelize.models;
        let date = requestedDate ? moment(requestedDate) : moment();
        date = date.format('YYYY-MM-DDT00:00:00Z');
        let currencyData = await Currency.findAll({
            include: [{
                where: {
                    date,
                },
                model: CurrencyRate,
                required: false,
            }],
        });
        return currencyData ? currencyData : [];
    };

    Currency.associate = models => {
      Currency.hasMany(models.CurrencyRate);
      Currency.hasMany(models.Stock);
    };

    return Currency;
};