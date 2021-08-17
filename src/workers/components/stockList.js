const {
    DB_CONSUMER_ID,
} = require('../../config/constants').workersConfig;
const { getStocksList, setStocksList } = require('../../services/moex.service');

let sendMessage;
let isStocksRecieved = false;

//one-time action
const fetchStocksList = async (force = false) => {
    let list = await getStocksList(force);
    if (list.length === 0) {
      list = await getStocksList(true);
    }
    if (!isStocksRecieved) {
      sendMessage(DB_CONSUMER_ID, 'loadStockList', list);
    }
};

exports.getStocksList = fetchStocksList;

exports.setStocks = list => {
  if (list.length > 0) {
    isStocksRecieved = true;
  }
  setStocksList(list);
};

/**
 * Set regular and one-time tasks
 * @public
 */
exports.init = async(sendMsg) => {
    if (!sendMsg) { return; }
    sendMessage = sendMsg;

    setTimeout(() => {
        sendMessage(DB_CONSUMER_ID, 'getStockList', '');
    }, 1000);

    setTimeout(() => {
        fetchStocksList();
    }, 5000);

};