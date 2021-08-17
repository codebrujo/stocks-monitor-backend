const moment = require('moment');

/**
 * CurrencyRate Schema, static and instance methods
 * designed for https://www.cbr-xml-daily.ru/daily_json.js source
 */
module.exports = (sequelize, DataTypes) => {
    const CurrencyRate = sequelize.define('CurrencyRate', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        CurrencyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        rate: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
        nominal: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, { timestamps: false, });


    CurrencyRate.getRateByCharCode = async(currencyCharCode = 'USD', requestedDate) => {
        const { Currency } = CurrencyRate.sequelize.models;
        const { Sequelize } = CurrencyRate.sequelize;
        const { lt } = Sequelize.Op;
        let endDate = requestedDate ? moment(requestedDate) : moment();
        endDate = endDate.add(1, 'd').format('YYYY-MM-DDT00:00:00Z');
        let rateData = await CurrencyRate.findOne({
            attributes: [
                'rate',
                'nominal'
            ],
            include: [{
                attributes: [
                    'id'
                ],
                where: {
                    charCode: currencyCharCode
                },
                model: Currency,
                required: true,
            }],
            where: {
                date: {
                    [lt]: endDate,
                }
            },
            order: [
                [Sequelize.col('date'), 'DESC']
            ]
        });
        return rateData ? rateData.rate / rateData.nominal : 1;
    };

    CurrencyRate.getRate = async(CurrencyId, requestedDate) => {
        let dateToGet = requestedDate ? moment(requestedDate) : moment();
        dateToGet = dateToGet.format('YYYY-MM-DDT00:00:00Z');
        const instance = await CurrencyRate.findOne({
            where: {
                CurrencyId,
                date: dateToGet,
            },
        });
        return instance;
    };


    CurrencyRate.setRate = async(CurrencyId, rate, nominal, requestedDate) => {
        let dateToSet = requestedDate ? moment(requestedDate) : moment();
        dateToSet = dateToSet.format('YYYY-MM-DDT00:00:00Z');
        const instance = (await CurrencyRate.findOrCreate({
            where: {
                CurrencyId,
                date: dateToSet,
            },
            defaults: {
                CurrencyId,
                date: dateToSet,
                rate,
                nominal
            },
        }))[0];
        instance.rate = rate;
        instance.nominal = nominal;
        await instance.save();
        return instance;
    };

    CurrencyRate.associate = models => {
        CurrencyRate.belongsTo(models.Currency);
    };

    return CurrencyRate;
};