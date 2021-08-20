const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example'),
  allowEmptyValues: true,
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  pgConfig: {
    db: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    passwd: process.env.POSTGRES_PASSWORD,
  },
  blynkNotifications: {
    token: process.env.BLYNK_AUTH_TOKEN,
    path: 'https://blynk-cloud.com/@token/notify',
    start_time: 10,
    end_time: 22,
  },

  workersConfig: {
    currenciesURL: process.env.WRK_CURRENCIES_PATH,
    DB_CONSUMER_ID: 'dbConsumer.js',
    EXTERNAL_CONSUMER_ID: 'externalDataConsumer.js',
    WRK_CURRENCIES_SCHEDULE: process.env.WRK_CURRENCIES_SCHEDULE,
    WRK_STOCKPRICE_SCHEDULE: process.env.WRK_STOCKPRICE_SCHEDULE,
    WRK_PRICE_PATH: process.env.WRK_PRICE_PATH,
    WRK_INFO_PATH: process.env.WRK_INFO_PATH,
    WRK_STOCK_HISTORY_PATH: process.env.WRK_STOCK_HISTORY_PATH,
    WRK_STOCKHISTORY_SCHEDULE: process.env.WRK_STOCKHISTORY_SCHEDULE,
    WRK_STOCKINFO_SCHEDULE: process.env.WRK_STOCKINFO_SCHEDULE,
    WRK_STOCK_MARKET_LIST: process.env.WRK_STOCK_MARKET_LIST,
    WRK_STOCK_CANDLES: process.env.WRK_STOCK_CANDLES,
  }
};