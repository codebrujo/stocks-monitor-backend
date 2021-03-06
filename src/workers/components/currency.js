const { DB_CONSUMER_ID, WRK_CURRENCIES_SCHEDULE, currenciesURL } = require('../../config/constants').workersConfig;
const axios = require('axios');
const logger = require('../../config/logger');
const CronJob = require('cron').CronJob;

let currencies = [];
let sendMessage;
const isInitialized = () => {
  return typeof sendMessage === 'undefined' ? false : true;
};


const fetchData = async () => {
  if (!currencies.length || !isInitialized()) { return; }
  //https://www.cbr-xml-daily.ru/daily_json.js
  //http://localhost:3001/daily_json.js
  axios({
    method: 'get',
    url: currenciesURL,
  })
    .then(function (response) {
      sendMessage(DB_CONSUMER_ID, 'writeCurrencyRates', currencies.map((item) => {
        const rate = response.data.Valute[item.charCode] ? response.data.Valute[item.charCode].Value : 1;
        const nominal = response.data.Valute[item.charCode] ? response.data.Valute[item.charCode].Nominal : 1;
        return ({ id: item.id, rate, nominal });
      }));
    })
    .catch(function (error) {
      logger.error(`[fetchCurrencyRates] error ${error}`);
    });

};

/**
 * Set regular and one-time tasks
 * @public
 */
exports.handleCurrencyArrayUpdate = (arr) => {
  currencies = arr;
  if (currencies.length === 0) {
    sendMessage(DB_CONSUMER_ID, 'initCurrenciesList', [
      {
        charCode: "RUB",
        numCode: "643",
        name: "Рубль РФ",
      },
      {
        charCode: "USD",
        numCode: "840",
        name: "Доллар США",
      },
    ]);
    setTimeout(() => {
      sendMessage(DB_CONSUMER_ID, 'getCurrenciesList', '');
    }, 500);
  }
};

/**
 * Set regular and one-time tasks
 * @public
 */
exports.init = async (sendMsg) => {
  if (!sendMsg) { return; }
  sendMessage = sendMsg;
  const job = new CronJob(WRK_CURRENCIES_SCHEDULE, function () {
    fetchData();
  }, null, true, 'Europe/Moscow');
  job.start();

  setTimeout(() => {
    if (!currencies.every(currentValue => currentValue.obtained)) { fetchData(); }
  }, 5000);

  setInterval(() => {
    sendMessage(DB_CONSUMER_ID, 'getCurrenciesList', '');
  }, 1800000);

  setTimeout(() => {
    sendMessage(DB_CONSUMER_ID, 'getCurrenciesList', '');
  }, 1000);

};