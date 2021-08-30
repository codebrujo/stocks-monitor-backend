const moment = require('moment');
const { defaultVolatility } = require('../config/constants')
/**
 * Stock Schema
 */
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    CompanyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CurrencyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ratio: {
      type: DataTypes.DECIMAL(6, 1),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: false
    },
    multiplier: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    volatility: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: true
    },
    link: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
  }, {
    timestamps: false,
  });

  Stock.add = async (ticker, CompanyId, ratio, paramVolatility) => {
    const volatility = paramVolatility ? paramVolatility : defaultVolatility;
    if (!ticker) { return null; }
    const stock = await Stock.findOrCreate({
      where: {
        ticker: ticker
      },
      defaults: {
        CompanyId,
        ticker,
        currency: 'RUB',
        CurrencyId: 1,
        ratio,
        price: 0,
        multiplier: 1,
        volatility,
        link: `https://invest.yandex.ru/catalog/stock/${ticker}/`
      }
    });
    return stock;
  };

  Stock.findByTicker = async (ticker, user) => {
    if (!ticker) { return null; }
    const { Notification } = Stock.sequelize.models;
    const { eq } = Stock.sequelize.Sequelize.Op;

    const stock = await Stock.findOne({
      attributes: [
        'id', 'ticker', 'currency', 'ratio', 'price', 'multiplier', 'link'
      ],
      where: {
        ticker: ticker
      },
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
    });
    return stock;
  };

  /**
   * Returns monthly agregated records for the last half a year
   *
   * @param       fromDate        moment Object
   * @returns     { [] }          array of agregate records
   *
   **/
  Stock.prototype.getHalfYearAgregates = async function (fromDate) {
    const { Sequelize } = sequelize;
    const { gte } = Sequelize.Op;
    const { StockDetail } = sequelize.models;
    const startDate = fromDate.add(-6, 'month').format('YYYY-MM-DDT00:00:00.0000Z');
    const makeDate = Sequelize.literal('make_date(cast(extract(YEAR FROM "date") as integer), cast(extract(MONTH FROM "date") as integer), 1)');
    const chartData = await StockDetail.findAll({
      attributes: [
        [makeDate, 'date'],
        [Sequelize.fn('AVG', Sequelize.col('openValue')), 'openValue'],
        [Sequelize.fn('AVG', Sequelize.col('maxValue')), 'maxValue'],
        [Sequelize.fn('AVG', Sequelize.col('minValue')), 'minValue'],
        [Sequelize.fn('AVG', Sequelize.col('closeValue')), 'closeValue'],
        [Sequelize.fn('SUM', Sequelize.col('volume')), 'volume'],
        [Sequelize.fn('SUM', Sequelize.col('value')), 'value'],
      ],
      group: [makeDate],
      where: {
        StockId: this.id,
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
  Stock.prototype.getYearAgregates = async function (fromDate) {
    const { Sequelize } = sequelize;
    const { gte } = Sequelize.Op;
    const { StockDetail } = sequelize.models;
    const startDate = fromDate.add(-1, 'years').format('YYYY-MM-DDT00:00:00.0000Z');
    const makeDate = Sequelize.literal('make_date(cast(extract(YEAR FROM "date") as integer), cast(extract(MONTH FROM "date") as integer), 1)');
    const chartData = await StockDetail.findAll({
      attributes: [
        [makeDate, 'date'],
        [Sequelize.fn('AVG', Sequelize.col('openValue')), 'openValue'],
        [Sequelize.fn('AVG', Sequelize.col('maxValue')), 'maxValue'],
        [Sequelize.fn('AVG', Sequelize.col('minValue')), 'minValue'],
        [Sequelize.fn('AVG', Sequelize.col('closeValue')), 'closeValue'],
        [Sequelize.fn('SUM', Sequelize.col('volume')), 'volume'],
        [Sequelize.fn('SUM', Sequelize.col('value')), 'value'],
      ],
      group: [makeDate],
      where: {
        StockId: this.id,
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
  Stock.prototype.getMonthAgregates = async function (fromDate) {
    const { Sequelize } = sequelize;
    const { gte } = Sequelize.Op;
    const { StockDetail } = sequelize.models;
    const startDate = fromDate.add(-31, 'days').format('YYYY-MM-DDT00:00:00');
    let chartData = await StockDetail.findAll({
      attributes: [
        'date', 'openValue', 'maxValue', 'minValue', 'closeValue', 'volume', 'value'
      ],
      where: {
        StockId: this.id,
        date: {
          [gte]: startDate
        },
      },
      limit: 30,
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
  Stock.prototype.getWeekAgregates = async function () {
    const { Sequelize } = sequelize;
    const { StockDetail } = sequelize.models;
    const chartData = await StockDetail.findAll({
      attributes: [
        'date', 'openValue', 'maxValue', 'minValue', 'closeValue', 'volume', 'value'
      ],
      where: { StockId: this.id },
      limit: 7,
      order: [
        [Sequelize.col('date'), 'DESC']
      ]
    });

    return chartData;
  };

  /**
   * Returns price on requested date
   *
   * @returns     {Number}          Price value
   *
   **/
  Stock.prototype.getPriceOnDate = async function (onDate = Date()) {
    const { Sequelize } = sequelize;
    const { lt } = Sequelize.Op;
    const { StockDetail } = sequelize.models;
    try {
      const endDate = moment(onDate).add(1, 'days').format('YYYY-MM-DDT00:00:00');
      const result = await StockDetail.findOne({
        where: {
          StockId: this.id,
          date: {
            [lt]: endDate
          },
        },
        order: [
          [Sequelize.col('date'), 'DESC']
        ]
      });
      return result ? parseFloat(result.dataValues.closeValue) : 0;
    } catch (error) {
      throw error;
    }
  };

  Stock.associate = models => {
    Stock.belongsTo(models.Company);
    Stock.belongsTo(models.Currency);
    Stock.hasMany(models.Notification);
    Stock.hasMany(models.StockDetail);
    Stock.hasMany(models.PortfolioItem);
    Stock.hasMany(models.PortfolioMovement);
  };

  return Stock;
};