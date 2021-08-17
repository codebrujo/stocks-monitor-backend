const { DB_CONSUMER_ID, WRK_STOCKPRICE_SCHEDULE } = require('../../config/constants').workersConfig;
const logger = require('../../config/logger');
const CronJob = require('cron').CronJob;
const { fetchPrice } = require('../../services/moex.service');

let sendMessage;
const isInitialized = () => {
  return typeof sendMessage === 'undefined' ? false : true;
};

const requestPrice = async () => {
  if (!isInitialized()) {
    logger.error('requestPrice: component must be initialized first');
    return;
  }
  sendMessage(DB_CONSUMER_ID, 'updateStockInfo', await fetchPrice());
};

exports.requestPrice = requestPrice;

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

  setTimeout(() => {
    requestPrice();
  }, 2000);
};