const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const db = require('../models');
const { User  } = db;

const createUser = data => {
  const {
    email,
    password,
    name,
    surname,
    role,
    phone,
    country,
    region,
    blynkToken
  } = data;
  User.create({
    email,
    password,
    name,
    surname,
    role,
    phone,
    country,
    region,
    blynkToken
  });
  logger.info(`User ${email} created`);
}

exports.timeout = 1000;

exports.seed = async () => {
  const user = await User.findOne();
  if (!user) {
    let data;
    try {
      data = fs.readFileSync(path.normalize(`${__dirname}/data/user.json`));
    } catch (error) {
      logger.info('No user seed file found');
      return;
    }
    try {
      const json = JSON.parse(data);
      json.users.forEach(element => {
        createUser(element);
      });
    } catch (error) {
      logger.info(`Error on parsing JSON ${data}`);
    }
  }
}