const { DB_CONSUMER_ID, WRK_CURRENCIES_SCHEDULE, currenciesURL } = require('../../config/constants').workersConfig;
const axios = require('axios');
const logger = require('../../config/logger');
const CronJob = require('cron').CronJob;

let currencies = [];
let sendMessage;
const isInitialized = () => {
    return typeof sendMessage === 'undefined' ? false : true;
};


const fetchData = async() => {
    if (!currencies.length || !isInitialized()) { return; }
    //https://www.cbr-xml-daily.ru/daily_json.js
    //http://localhost:3001/daily_json.js
    axios({
            method: 'get',
            url: currenciesURL,
        })
        .then(function(response) {
            sendMessage(DB_CONSUMER_ID, 'writeCurrencyRates', currencies.map((item) => {
                return ({ id: item.id, rate: response.data.Valute[item.charCode].Value, nominal: response.data.Valute[item.charCode].Nominal });
            }));
        })
        .catch(function(error) {
            logger.error(`[fetchCurrencyRates] error ${error}`);
        });

};

/**
 * Set regular and one-time tasks
 * @public
 */
exports.handleCurrencyArrayUpdate = (arr) => {
    currencies = arr;
};

/**
 * Set regular and one-time tasks
 * @public
 */
exports.init = async(sendMsg) => {
    if (!sendMsg) { return; }
    sendMessage = sendMsg;
    const job = new CronJob(WRK_CURRENCIES_SCHEDULE, function() {
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