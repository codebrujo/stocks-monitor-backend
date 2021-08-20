const {
  WRK_STOCK_MARKET_LIST,
  WRK_STOCK_CANDLES,
  WRK_PRICE_PATH,
  WRK_INFO_PATH,
  WRK_STOCK_HISTORY_PATH,
} = require('../config/constants').workersConfig;
const axios = require('axios');
const logger = require('../config/logger');
const moment = require('moment');

let stocks = [];
let lastUpdated;

exports.setStocksList = stockList => {
  stocks = stockList;
}

const fetchMarketListItemsValues = async (ind, list) => {
  const dateTill = moment().date(1).add(-1, 'd');
  const dateFrom = moment(dateTill).add(-1, 'y').date(1);
  const ticker = list[ind][0];
  const historyURL = `${WRK_STOCK_CANDLES.replace('@TICKER', ticker)}&from=${dateFrom.format('YYYY-MM-DD')}&till=${dateTill.format('YYYY-MM-DD')}`;
  return await axios({
    method: 'get',
    url: historyURL,
  })
    .then(async (response) => {
      if (ind < list.length - 1) {
        let avr = response.data.candles.data.reduce((initValue, item) => {
          return initValue + parseFloat(item[4]); //value
        }, 0);
        if (response.data.candles.data.length) {
          avr = avr / response.data.candles.data.length;
        } else {
          avr = 0;
        }
        list[ind].push(avr);
        await fetchMarketListItemsValues(ind + 1, list);
      }
      return list;
    })
    .catch(function (error) {
      logger.error(`[fetchMarketList] call ${historyURL} error ${error}`);
    });
};

const fetchMarketList = async (start = 0, list = []) => {
  const historyURL = `${WRK_STOCK_MARKET_LIST}&start=${start}`;
  return await axios({
    method: 'get',
    url: historyURL,
  })
    .then(async (response) => {
      console.log('fetchMarketList resolve', start);
      if (response.data.securities.data.length) {
        const listToCombine = await fetchMarketListItemsValues(0, response.data.securities.data);
        list.push(...listToCombine);
        list = await fetchMarketList(start += 100, list);
      }
      return list;
    })
    .catch(function (error) {
      logger.error(`[fetchMarketList] call ${historyURL} error ${error}`);
    });
};

//one-time action
exports.getStocksList = async (force) => {
  if (typeof stocks === 'undefined' && !force) {
    return [];
  }
  if (stocks && stocks.length > 0 && !force) {
    return stocks;
  }
  const list = (await fetchMarketList()).reduce((initValue, item) => {
    const monthlyTurnover = parseFloat(item[7]);
    if (monthlyTurnover > 100000000 && moment(item[6]).isAfter(moment().add(-1, 'M'))) {
      let companyName = item[2];
      companyName.replace(/([А-Яа-я0-9_"-\.\s])(ап\.?|ао\.?|акции обыкн\.|акции об\.|акц\.пр\.)/gi, '$1').trim();
      companyName = companyName.replace(/([а-яА-Я0-9_"-\.\s?])(-ап|\ -\ ао|ап\.?|ао\.?|акции обыкн\.|акции об\.|акц\.пр\.)([а-я0-9_"-\.\s\(\)])*?$/g, '$1');
      companyName = companyName.replace(/^(ао\s|ап\s)([а-яА-Я0-9_"-\.\s\(\)]*)/g, '$2').trim();
      initValue.push({
        ticker: item[0],
        company: companyName,
        monthlyTurnover,
        CompanyId: 0,
      });
    }
    return initValue;
  }, []);
  stocks = list.map(item => item.ticker);
  return list;
};

exports.fetchStocksInfo = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: WRK_INFO_PATH,
    });
    return await response.data.securities.data.map((item) => {
      return ({
        ticker: item[0],
        price: parseFloat(item[1]),
        multiplier: item[2],
        prevprice: item[3],
      });
    });
  } catch (error) {
    logger.error(`[moex.service.fetchStockPrice] error ${error}`);
  }
}

exports.fetchPrice = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: WRK_PRICE_PATH,
    });
    return await response.data.marketdata.data.map((item) => {
      return ({
        ticker: item[0],
        price: parseFloat(item[1]),
      });
    });
  } catch (error) {
    logger.error(`[moex.service.fetchStockPrice] error ${error}`);
  }
}

/**
 * Запрашивает изменение стоимости цены акции в периоде
 *
 * @param {String} ticker           Тикер акции
 * @param {String} dateFrom         С какой даты запрашивать
 * @param {String} dateTill         По какую дату запрашивать
 */
exports.fetchHistory = async (ticker, dateFrom, dateTill) => {
  const historyURL = `${WRK_STOCK_HISTORY_PATH.replace('@TICKER', ticker)}&from=${dateFrom}&till=${dateTill}`;
  try {
    const response = await axios({
      method: 'get',
      url: historyURL,
    });
    const dataset = await response.data.history.data;
    logger.info(`[moex.service.fetchHistory] for ${ticker}: ${historyURL} ${dataset}`);
    return {
      ticker,
      values: dataset,
    };

  } catch (error) {
    logger.error(`[moex.service.fetchHistory] call ${historyURL} error ${error}`);
  }
};
