const { DB_CONSUMER_ID, WRK_STOCKPRICE_SCHEDULE, WRK_STOCKINFO_SCHEDULE } = require('../../config/constants').workersConfig;
const logger = require('../../config/logger');
const CronJob = require('cron').CronJob;
const { fetchPrice, fetchStocksInfo } = require('../../services/moex.service');

let sendMessage;
const isInitialized = () => {
  return typeof sendMessage === 'undefined' ? false : true;
};

const requestPrice = async () => {
  if (!isInitialized()) {
    logger.error('requestPrice: component must be initialized first');
    return;
  }
  const res = await fetchPrice();
  //logger.info(`[stockPrice.component.worker] call. Price result: ${res}`);
  sendMessage(DB_CONSUMER_ID, 'updateStockPrice', res);
};

const requestInfo = async () => {
  if (!isInitialized()) {
    logger.error('requestPrice: component must be initialized first');
    return;
  }
  sendMessage(DB_CONSUMER_ID, 'updateStockInfo', await fetchStocksInfo());
};

exports.requestPrice = requestPrice;

exports.requestInfo = requestInfo;

/**
 * Set regular and one-time tasks
 * @public
 */
exports.init = async (sendMsg) => {
  if (!sendMsg) { return; }
  sendMessage = sendMsg;
  const job = new CronJob(WRK_STOCKPRICE_SCHEDULE, function () {
    requestPrice();
  }, null, true, 'Europe/Moscow');
  job.start();

  const jobInfo = new CronJob(WRK_STOCKINFO_SCHEDULE, function () {
    requestInfo();
  }, null, true, 'Europe/Moscow');
  jobInfo.start();

};