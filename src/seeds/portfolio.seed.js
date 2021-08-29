const fs = require('fs');
const path = require('path');
const moment = require('moment');
const logger = require('../config/logger');
const db = require('../models');
const { User, Stock, PortfolioItem } = db;

const createPortfolioItem = async (item, user) => {
  const stock = await Stock.findOne({
    where: {
      ticker: item.stock
    }
  });
  if (!stock) {
    logger.info(`Ticker ${item.stock} is not found`);
    return;
  }
  PortfolioItem.addItem(
    {
      price: stock.price * stock.multiplier,
      quantity: item.quantity,
      purchaseDate: moment().format('YYYY-MM-DDT10:00:00')
    },
    user,
    stock);
  logger.info(`Ticker ${item.stock} added to user ${user.email}`);
}

exports.timeout = 80000;

exports.seed = async () => {
  let data;
  try {
    data = fs.readFileSync(path.normalize(`${__dirname}/data/portfolio.json`));
  } catch (error) {
    logger.info('No portfolio seed file found');
    return;
  }
  let json;
  try {
    json = JSON.parse(data);
  } catch (error) {
    logger.info(`Error on parsing JSON ${data}`);
    return;
  }
  const user = await User.findOne({
    where: {
      email: json.user
    }
  });
  if (!user) {
    logger.info('No specified user found');
    return;
  }
  let portfolioItem = await PortfolioItem.findOne({
    where: {
      UserId: user.id,
    }
  });
  if (!portfolioItem) {
    try {
      json.stocks.forEach(element => {
        createPortfolioItem(element, user);
      });
    } catch (error) {
      logger.info(`Error on creating portfolio`);
    }
  }
}