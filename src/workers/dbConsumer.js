const { workerData, parentPort } = require('worker_threads');
const logger = require('../config/logger');
const { EXTERNAL_CONSUMER_ID } = require('../config/constants').workersConfig;
const { defaultVolatility } = require('../config/constants');
const { getPrecision } = require('../utils/helpers');
const { getHighPrice, getLowPrice } = require('./components/notifications');
const moment = require('moment');

const db = require('../models');
const {
  Currency,
  CurrencyRate,
  Stock,
  StockDetail,
  Company,
  Notification,
  User,
  PortfolioMovement,
  PortfolioItem,
  PortfolioDetail,
  sequelize
} = db;
const {
  QueryTypes,
  Op,
  fn,
  literal,
  col,
} = sequelize.Sequelize;
const LOCAL_INSTANCE_ID = workerData;

const sendMessage = async (recepientId, type, data) => {
  parentPort.postMessage({
    sender: LOCAL_INSTANCE_ID,
    recepient: recepientId,
    type,
    data,
  });
};


const updateStockHistory = async (payload) => {
  Stock.findOne({
    where: {
      ticker: payload.ticker,
    },
  }).then(stock => {
    payload.values.map((item) => {
      if (item[1] && item[4]) {
        StockDetail.setValues(stock.id, ...item);
      }
    });
  });
};

const writeCurrencyRates = async (payload) => {
  payload.map((item) => {
    CurrencyRate.setRate(item.id, item.rate, item.nominal);
  });
};

const notifyUser = async (message, UserId) => {
  const user = await User.findOne({
    where: {
      id: UserId,
    }
  });
  if (user) {
    sendMessage(EXTERNAL_CONSUMER_ID, 'notifyUser', { user, message });
  }
};


const createNotifications = async () => {
  
}

const getNotifications = async (payload) => {
  const notifications = await Notification.findAll();
  notifications.forEach(element => {
    const value = payload.find(item => item.StockId === element.dataValues.StockId);
    let message = null;
    if (value) {
      //если произошло увеличение цены и новая цена превышает верхнюю границу уведомления
      if (value.price > value.prevprice && value.price >= element.dataValues.highPrice) {
        message = `${value.ticker} UP TO ${element.dataValues.highPrice}`;
        //или произошло уменьшение цены и новая цена ниже нижней границы уведомления
      } else if (value.price < value.prevprice && value.price <= element.dataValues.lowPrice) {
        message = `${value.ticker} DOWN TO ${element.dataValues.lowPrice}`;
      }
    }
    //send notification to user and update it
    if (message) {
      notifyUser(message, element.UserId);
      const payload = {
        highPrice: getHighPrice(value.price, value.stock),
        lowPrice: getLowPrice(value.price, value.stock),
      }
      Notification.addItem(payload, { id: element.UserId }, value.stock)
    }
  });

};

const updateStockPrice = async (payload) => {
  const processedList = [];
  const stocks = await Stock.findAll();
  stocks.forEach(element => {
    const value = payload.find(item => item.ticker === element.dataValues.ticker);
    const prevprice = element.price;
    if (value && parseFloat(prevprice) !== value.price) {
      element.price = value.price;
      element.save();
      //values: ['TRADEDATE','OPEN','LOW','HIGH','CLOSE','VOLUME','VALUE']
      updateStockHistory({
        ticker: element.ticker,
        values: [moment(), value.price, value.price, value.price, value.price, 0, 0],
      });
      processedList.push({ prevprice, price: value.price, StockId: element.id, stock: element });
    }
  });
  getNotifications(processedList);
};

const updateStockInfo = async (payload) => {
  const processedList = [];
  const stocks = await Stock.findAll();
  stocks.forEach(element => {
    const value = payload.find(item => item.ticker === element.dataValues.ticker);
    if (value && parseFloat(element.price) !== value.price) {
      element.price = value.price;
      element.multiplier = value.multiplier;
      element.save();
      //values: ['TRADEDATE','OPEN','LOW','HIGH','CLOSE','VOLUME','VALUE']
      updateStockHistory({
        ticker: element.ticker,
        values: [moment(), value.price, value.price, value.price, value.price, 0, 0],
      });
      processedList.push({ ...value, StockId: element.id });
    }
  });
};

const getStockList = async (recepientId) => {
  const stocks = await Stock.findAll({
    attributes: ['ticker']
  });
  const lastUpdated = await StockDetail.getLatestDate();
  sendMessage(recepientId, 'stockList', { list: stocks.map((element) => element.dataValues.ticker), lastUpdated });
};

const getCurrenciesList = async (recepientId) => {
  const recordset = await Currency.getCurrenciesWithRates();
  if (recordset) {
    sendMessage(recepientId, 'currenciesList', recordset.map((item) => {
      return ({ id: item.dataValues.id, charCode: item.dataValues.charCode, obtained: item.dataValues.CurrencyRates.length ? true : false });
    }));
  }
};

const fillInCompanyIds = async (list, ind = 0) => {
  if (!list || list.length === 0) {
    return [];
  }
  let company = await Company.findOne({
    where: {
      name: list[ind].company,
    },
  });
  if (!company) {
    company = await Company.create({
      name: list[ind].company,
      description: list[ind].company,
      cap: 0,
      link: '',
    });
  }
  list[ind].CompanyId = company.id;
  if (ind < list.length - 1) {
    await fillInCompanyIds(list, ind + 1);
  }
  return list;
};


const loadStockList = async (list) => {
  logger.info(`${LOCAL_INSTANCE_ID} Load stocks list`);
  const filledList = await fillInCompanyIds(list);
  const maxTurnover = filledList.reduce((initValue, item) => {
    return Math.max(initValue, item.monthlyTurnover);
  },
    1);
  filledList.map((item) => {
    let volatility = defaultVolatility;
    if (item.monthlyTurnover > maxTurnover / 2) {
      volatility = +(defaultVolatility / 3).toFixed(1);
    } else if ((item.monthlyTurnover > maxTurnover / 3)) {
      volatility = +(defaultVolatility / 2).toFixed(1);
    }
      Stock.add(item.ticker, item.CompanyId, +(5 * item.monthlyTurnover / maxTurnover).toFixed(1), volatility);
  });
};

const calculatePortfolioItem = async (UserId, StockId, quantity) => {
  //выбираем все поступления в обратном хронологическом порядке
  const { gt } = Op;
  const incomes = await PortfolioMovement.findAll({
    where: {
      UserId,
      StockId,
      quantity: {
        [gt]: 0
      },
    },
    include: [{
      attributes: ['multiplier', 'price'],
      model: Stock,
      required: true,
    }],
    order: [
      ['movementDate', 'DESC']
    ]
  });
  let cost = 0;
  let q = quantity;
  let purchaseDate;
  //вычислим точность текущей цены акции
  const precision = getPrecision(parseFloat(incomes[0].Stock.dataValues.price));
  //запоминаем множитель минимального пакета приобретения
  const multiplier = incomes[0].Stock.dataValues.multiplier;
  //двигаемся в цикле к поступлению, где перекрывается текущий остаток
  //для каждой записи поступления вычисляем средневзвешенную стоимость акции
  for (let i = 0; i < incomes.length; i++) {
    if (typeof purchaseDate === 'undefined') {
      purchaseDate = incomes[i].movementDate;
    }
    if (q >= incomes[i].quantity) {
      cost += parseFloat(incomes[i].sum);
    } else {
      cost += parseFloat(incomes[i].sum) / incomes[i].quantity * q;
    }
    q = q - incomes[i].quantity;
    if (q <= 0) { break; }
  }
  //итоговую средневзвешенную цену приводим к точности текущей цены
  PortfolioItem.create({
    UserId,
    StockId,
    purchaseDate,
    price: +(cost / quantity / multiplier).toFixed(precision),
    quantity,
  });
};

const recalculateUserPortfolio = async (UserId) => {
  //clear items
  await sequelize.query(`DELETE FROM "PortfolioItems" WHERE "UserId" = ${UserId}`, { type: QueryTypes.DELETE });
  //calculate non-zero BOH (balance on hands)
  const totals = await sequelize.query(`
    SELECT "StockId", SUM("quantity") as quantity
    FROM "PortfolioMovements"
    where "UserId" = ${UserId}
    group by "StockId"
    having SUM("quantity") > 0
    ;`, { type: QueryTypes.SELECT });
  //write new values
  totals.forEach((item) => {
    calculatePortfolioItem(UserId, item.StockId, item.quantity);
  });
};

const recalculatePortfolioItems = async () => {
  const users = await sequelize.query('SELECT DISTINCT "UserId" FROM "PortfolioMovements"', { type: QueryTypes.SELECT });
  users.forEach((item) => {
    recalculateUserPortfolio(item.UserId);
  });
};

const calculatePortfolioDetails = async () => {
  const items = await sequelize.query(`
    SELECT "PortfolioItem"."UserId", SUM("PortfolioItem".quantity*"Stock".price*"Stock".multiplier) AS "value"
    FROM "PortfolioItems" AS "PortfolioItem" 
    INNER JOIN "Stocks" AS "Stock" ON "PortfolioItem"."StockId" = "Stock"."id"
    GROUP BY "UserId";
    `, { type: QueryTypes.SELECT });
  items.map((item) => {
    PortfolioDetail.setValue(item.UserId, item.value);
  });
};

const initCurrenciesList = arr => {
  arr.map(async item => {
    let el = await Currency.findOne({
      where: {
        charCode: item.charCode,
      },
    });
    if (!el) {
      el = Currency.create({
        charCode: item.charCode,
        numCode: item.numCode,
        name: item.name
      });
    }
  });
}

setInterval(() => {
  recalculatePortfolioItems();
}, 10800000);

setInterval(() => {
  calculatePortfolioDetails();
}, 1800000);

/**
 * Current thread message processor
 * @private
 */
const processMessageLocally = async (msg) => {
  // console.log('dbConsumer.worker processMessageLocally' + JSON.stringify(msg));
  switch (msg.type) {
    case 'getCurrenciesList':
      getCurrenciesList(msg.sender);
      break;
    case 'writeCurrencyRates':
      writeCurrencyRates(msg.data);
      break;
    case 'updateStockInfo':
      updateStockInfo(msg.data);
      break;
    case 'getStockList':
      getStockList(msg.sender);
      break;
    case 'writeStockPrice':
      writeStockPrice(msg.data);
      break;
    case 'updateStockHistory':
      updateStockHistory(msg.data);
      break;
    case 'loadStockList':
      loadStockList(msg.data);
      break;
    case 'initCurrenciesList':
      initCurrenciesList(msg.data);
      break;
    case 'updateStockPrice':
      updateStockPrice(msg.data);
      break;
    default:
      logger.info(`${LOCAL_INSTANCE_ID} unhandled message: 
            From: ${msg.sender} 
            To: ${msg.recepient} 
            Type: ${msg.type} 
            Data: ${JSON.stringify(msg.data)} 
            Timestamp: ${msg.timestamp}`);
  }
};

/**
 * System handlers
 * @private
 */
process.on('disconnect', () => {
  logger.error(`${LOCAL_INSTANCE_ID} is disconnected from parent process.Exitting...`);
  process.exit();
});
parentPort.on('message', (msg) => {
  if (typeof msg === 'object' && msg.recepient) {
    processMessageLocally(msg);
  } else {
    logger.info(`${LOCAL_INSTANCE_ID}: ${msg}`);
  }
});
parentPort.postMessage(`Worker ${LOCAL_INSTANCE_ID} started`);
