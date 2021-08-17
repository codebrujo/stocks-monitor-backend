/**
 * Бизнес-логика получения исторических данных о цене, объемах и оборотах с биржи
 */
const {
  DB_CONSUMER_ID,
  WRK_STOCKHISTORY_SCHEDULE,
} = require('../../config/constants').workersConfig;
const logger = require('../../config/logger');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const { fetchHistory } = require('../../services/moex.service');

let stocks = [];
let lastUpdated;

let sendMessage;
const isInitialized = () => {
  return typeof sendMessage === 'undefined' ? false : true;
};

/**
 * Вызывает метод получения изменения стоимости цены акции в периоде
 * В случае успешного получения данных инициирует отправку сообщения
 * в обработчик запросов к DB
 *
 * @param {String} ticker           Тикер акции
 * @param {String} dateFrom         С какой даты запрашивать
 * @param {String} dateTill         По какую дату запрашивать
 */
const fetchData = async (ticker, dateFrom, dateTill) => {
  logger.info(`[stockHistory.fetchData]: fetching prices for ${ticker} from ${dateFrom} till ${dateTill}`);
  sendMessage(DB_CONSUMER_ID, 'updateStockHistory', await fetchHistory(ticker, dateFrom, dateTill));
};

/**
 * Обходит все существующие в системе акции и вызывает по каждой отправку запроса к внешнему API
 * @public
 *
 * @param {Object} params           Опциональный объект, содержащий дату начала запроса, количество дней и тикер
 */
const requestHistory = (params = { from: moment().add(-1, 'd'), days: 0, ticker: null }) => {
  if (!isInitialized()) {
    logger.error('requestHistory: component must be initialized first');
    return;
  }
  const { from, days, ticker } = params;
  const dateTill = moment(from).format('YYYY-MM-DD');
  const dateFrom = moment(from).add(-days, 'd').format('YYYY-MM-DD');
  if (ticker) {
    setTimeout(() => fetchData(ticker, dateFrom, dateTill), days * 1000);
  } else {
    stocks.map((reqticker, ind) => {
      //make a delay to avoid external API ban
      setTimeout(() => fetchData(reqticker, dateFrom, dateTill), days * 1000 + ind * 1000);
    });
  }
};

/**
 * Устанавливает массив тикеров существующих в системе акций
 * @public
 */
exports.handleStockArrayUpdate = (payload) => {
  stocks = payload.list;
  lastUpdated = payload.lastUpdated;
};


/**
 * Вызов обновления исторических данных по внешнему запросу
 * @public
 */
exports.requestHistory = requestHistory;

const initHistoryData = () => {
  logger.info('[stockHistory.initHistoryData]: plan historical rates request for 0-100 days');
  requestHistory({ from: moment(), days: 100 });
  logger.info('[stockHistory.initHistoryData]: plan historical rates request for 100-200 days');
  requestHistory({ from: moment().add(-100, 'd'), days: 100 });
  logger.info('[stockHistory.initHistoryData]: plan historical rates request for 200-300 days');
  requestHistory({ from: moment().add(-200, 'd'), days: 100 });
  logger.info('[stockHistory.initHistoryData]: plan historical rates request for 300-400 days');
  requestHistory({ from: moment().add(-300, 'd'), days: 100 });
};

/**
 * Вызов начального заполнения исторических данных по внешнему запросу
 * @public
 */
exports.initHistoryData = initHistoryData;

/**
 * Инициализация логики модуля
 * @public
 */
exports.init = async (sendMsg) => {
  if (!sendMsg) { return; }
  sendMessage = sendMsg;
  const job = new CronJob(WRK_STOCKHISTORY_SCHEDULE, function () {
    requestHistory();
  }, null, true, 'Europe/Moscow');
  job.start();

  setInterval(() => {
    sendMessage(DB_CONSUMER_ID, 'getStockList', '');
  }, 3600000);

  setTimeout(() => {
    //dbConsumer error
    if (typeof lastUpdated === 'undefined') {
      return;
    }
    //no historical data at all
    if (lastUpdated === null) {
      initHistoryData();
    }
    //first time daily start
    const yesterday = moment().add(-1, 'd').startOf('day');
    if (yesterday.isAfter(lastUpdated)) {
      requestHistory({ from: yesterday, days: yesterday.diff(moment(lastUpdated), 'days'), ticker: null });
    }
  }, 5000);

  setTimeout(() => {
    sendMessage(DB_CONSUMER_ID, 'getStockList', '');
  }, 1000);

};