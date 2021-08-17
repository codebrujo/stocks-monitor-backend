const { DB_CONSUMER_ID, WRK_STOCKPRICE_SCHEDULE, WRK_PRICE_PATH } = require('../../config/constants').workersConfig;
const axios = require('axios');
const logger = require('../../config/logger');
const CronJob = require('cron').CronJob;

let sendMessage;
const isInitialized = () => {
    return typeof sendMessage === 'undefined' ? false : true;
};

const fetchData = async() => {
    axios({
            method: 'get',
            url: WRK_PRICE_PATH,
        })
        .then(function(response) {
            logger.info(`[fetchStockPrice] update price using ${WRK_PRICE_PATH}`);
            sendMessage(DB_CONSUMER_ID, 'updateStockInfo', response.data.securities.data.map((item) => {
                return ({
                    ticker: item[0],
                    price: parseFloat(item[1]),
                    multiplier: item[2],
                    prevprice: item[3],
                });
            }));
        })
        .catch(function(error) {
            logger.error(`[fetchStockPrice] error ${error}`);
        });
};

exports.requestPrice = () => {
    if (!isInitialized()) {
        logger.error('requestPrice: component must be initialized first');
        return;
    }
    fetchData();
};


/**
 * Set regular and one-time tasks
 * @public
 */
exports.init = async(sendMsg) => {
    if (!sendMsg) { return; }
    sendMessage = sendMsg;
    const job = new CronJob(WRK_STOCKPRICE_SCHEDULE, function() {
        fetchData();
    }, null, true, 'Europe/Moscow');
    job.start();

    setTimeout(() => {
        fetchData();
    }, 2000);

};