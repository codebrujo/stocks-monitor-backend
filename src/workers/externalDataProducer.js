const { workerData, parentPort } = require('worker_threads');
const logger = require('../config/logger');
const LOCAL_INSTANCE_ID = workerData;
const Currency = require('./components/currency');
const StockPrice = require('./components/stockPrice');
const StockHistory = require('./components/stockHistory');
const StockList = require('./components/stockList');

const sendMessage = async(recepient, type, data) => {
    parentPort.postMessage({
        recepient,
        type,
        data,
    });
};

/**
 * Current thread message processor
 * @private
 */
const processMessageLocally = async(msg) => {
    switch (msg.type) {
        case 'currenciesList':
            Currency.handleCurrencyArrayUpdate(msg.data);
            break;
        case 'stockList':
            StockHistory.handleStockArrayUpdate(msg.data);
            break;
        case 'requestHistory':
            StockHistory.requestHistory(msg.data);
            break;
        case 'initHistoryData':
            StockHistory.initHistoryData();
            break;

    }
};

// Init components to setup regular tasks and shared variable 'sendMessage'
Currency.init(sendMessage);
StockPrice.init(sendMessage);
StockHistory.init(sendMessage);
StockList.init(sendMessage);

/**
 * Plan regular thread restart
 * @private
 */
setTimeout(() => {
    process.exit();
}, 10800000);

/**
 * System handlers
 * @private
 */
process.on('disconnect', () => {
    logger.error(`${LOCAL_INSTANCE_ID} is disconnected from parent process. Exitting...`);
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