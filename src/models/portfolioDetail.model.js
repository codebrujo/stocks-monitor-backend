const moment = require('moment');
/**
 * PortfolioDetail Schema, static and instance methods
 */
module.exports = (sequelize, DataTypes) => {
    const PortfolioDetail = sequelize.define('PortfolioDetail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false
        },
    }, { timestamps: false, });

    PortfolioDetail.get = async(user, requestedDate) => {
        const reqDate = requestedDate ? moment(requestedDate).format('YYYY-MM-DDT00:00:00') : moment().format('YYYY-MM-DDT00:00:00');
        let currentValue = await PortfolioDetail.findOne({
            attributes: ['value'],
            where: {
                UserId: user.id,
                date: reqDate,
            },
        });
        return currentValue ? parseFloat(currentValue.dataValues.value) : 0;
    };

    /**
     * Returns monthly agregated records for the last half a year
     *
     * @param       fromDate        moment Object
     * @returns     { [] }          array of agregate records
     *
     **/
    PortfolioDetail.getHalfYearAgregates = async(user, fromDate) => {
        const { Sequelize } = PortfolioDetail.sequelize;
        const { gte } = Sequelize.Op;
        const startDate = fromDate.add(-6, 'month').format('YYYY-MM-DDT00:00:00.0000Z');
        const makeDate = Sequelize.literal('make_date(cast(extract(YEAR FROM "date") as integer), cast(extract(MONTH FROM "date") as integer), 1)');
        const chartData = await PortfolioDetail.findAll({
            attributes: [
                [makeDate, 'date'],
                [Sequelize.fn('AVG', Sequelize.col('value')), 'value'],
            ],
            group: [makeDate],
            where: {
                UserId: user.id,
                date: {
                    [gte]: startDate
                },
            },
            order: [
                [makeDate, 'DESC']
            ]
        });
        return chartData;
    };

    /**
     * Returns monthly agregated records for the last year
     *
     * @param       fromDate        moment Object
     * @returns     { [] }          array of agregate records
     *
     **/
    PortfolioDetail.getYearAgregates = async(user, fromDate) => {
        const { Sequelize } = PortfolioDetail.sequelize;
        const { gte } = Sequelize.Op;
        const startDate = fromDate.add(-1, 'years').format('YYYY-MM-DDT00:00:00.0000Z');
        const makeDate = Sequelize.literal('make_date(cast(extract(YEAR FROM "date") as integer), cast(extract(MONTH FROM "date") as integer), 1)');
        const chartData = await PortfolioDetail.findAll({
            attributes: [
                [makeDate, 'date'],
                [Sequelize.fn('AVG', Sequelize.col('value')), 'value'],
            ],
            group: [makeDate],
            where: {
                UserId: user.id,
                date: {
                    [gte]: startDate
                },
            },
            order: [
                [makeDate, 'DESC']
            ]
        });
        return chartData;
    };

    /**
     * Returns month agregates
     *
     * @param       fromDate        moment Object
     * @returns     { [] }          array of agregate records
     *
     **/
    PortfolioDetail.getMonthAgregates = async(user, fromDate) => {
        const { Sequelize } = PortfolioDetail.sequelize;
        const { gte } = Sequelize.Op;
        const startDate = fromDate.add(-1, 'month').format('YYYY-MM-DDT00:00:00');
        let chartData = await PortfolioDetail.findAll({
            attributes: [
                'date', 'value'
            ],
            where: {
                UserId: user.id,
                date: {
                    [gte]: startDate
                },
            },
            order: [
                [Sequelize.col('date'), 'DESC']
            ]
        });
        chartData = chartData.reduce((reducedArray, item, ind, arr) => {
            //every third item excluding second and the second last, first and last are always included
            if (ind === 0 || ind === arr.length - 1 || (ind % 3 === 0 && ind !== 1 && ind !== arr.length - 2)) {
                reducedArray.push(item);
            }
            return reducedArray;
        }, []);

        return chartData;
    };

    /**
     * Returns last week agregates
     *
     * @returns     { [] }          array of agregate records
     *
     **/
    PortfolioDetail.getWeekAgregates = async(user) => {
        const { Sequelize } = PortfolioDetail.sequelize;
        const { lt } = Sequelize.Op;
        const chartData = await PortfolioDetail.findAll({
            attributes: [
                'date', 'value'
            ],
            where: {
                UserId: user.id,
                date: {
                    [lt]: Date()
                },

            },
            limit: 7,
            order: [
                [Sequelize.col('date'), 'DESC']
            ]
        });

        return chartData;
    };

    PortfolioDetail.setValue = async(UserId, value, dateToSet = moment()) => {
        const date = moment(dateToSet).format('YYYY-MM-DDT00:00:00Z');
        const instance = (await PortfolioDetail.findOrCreate({
            where: {
                UserId,
                date,
            },
            defaults: {
                UserId,
                date,
                label: date,
                value
            },
        }))[0];
        instance.value = value;
        await instance.save();
        return instance;
    };


    PortfolioDetail.associate = models => {
        PortfolioDetail.belongsTo(models.User);
    };

    return PortfolioDetail;
};