const moment = require('moment');
/**
 * StockDetail Schema
 */
module.exports = (sequelize, DataTypes) => {
    const StockDetail = sequelize.define('StockDetail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        StockId: {
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
        openValue: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
        maxValue: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
        minValue: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
        closeValue: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
        volume: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        value: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
    }, { timestamps: false, });

    /**
     * Returns last update date or null
     *
     * @returns {String}          Date of the latest record
     *
     **/
    StockDetail.getLatestDate = async() => {
        const { Sequelize } = sequelize;
        let record = await StockDetail.findOne({
            attributes: [
                [Sequelize.fn('MAX', Sequelize.col('date')), 'maxDate'],
            ],
        });
        return record.dataValues.maxDate;
    };


    StockDetail.setValues = async(StockId, reqDate, openValue, maxValue, minValue, closeValue, volume, value) => {
        const date = moment(reqDate).format('YYYY-MM-DDT00:00:00Z');
        let instance = await StockDetail.findOne({
            where: {
                StockId,
                date,
            },
        });
        if (instance) {
            instance.openValue = openValue;
            instance.maxValue = maxValue;
            instance.minValue = minValue;
            instance.closeValue = closeValue;
            instance.volume = volume;
            instance.value = value;
            await instance.save();
        } else {
            instance = await StockDetail.create({
                StockId,
                date,
                label: date,
                openValue,
                maxValue,
                minValue,
                closeValue,
                volume,
                value,
            });
        }
        return instance;
    };

    StockDetail.associate = models => {
        StockDetail.belongsTo(models.Stock);
    };

    return StockDetail;
};