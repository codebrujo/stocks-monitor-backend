const axios = require("axios");
const { blynkNotifications } = require('../../config/constants');
const { getPrecision } = require('../../utils/helpers');

const DEFAULT_VOLATILITY = 1.5;

exports.getHighPrice = (price, stock) => {
  const volatility = stock.volatility ? stock.volatility : DEFAULT_VOLATILITY;
  return parseFloat((price + price * volatility / 100).toFixed(getPrecision(price)));
}

exports.getLowPrice = (price, stock) => {
  const volatility = stock.volatility ? stock.volatility : DEFAULT_VOLATILITY;
  return parseFloat((price - price * volatility / 100).toFixed(getPrecision(price)));
}

exports.sendViaBlynk = (message, token) => {
  const volatility = stock.volatility ? stock.volatility : DEFAULT_VOLATILITY;
  return parseFloat((price - price * volatility / 100).toFixed(getPrecision(price)));
}

exports.updateBlynkPin = (token, message) => {
  axios({
    method: "put",
    url: blynkNotifications.vpinPath.replace('@token', token),
    headers: {
      'Content-Type': 'application/json',
    },
    data: [message],
  });
}