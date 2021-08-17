const fs = require('fs');
const path = require('path')
const { pgConfig } = require('../config/constants');
const testEnvSetup = require('../config/__mock__/constants');

const filename = path.resolve(__dirname, '..', 'config', 'sequelize-cli', 'config.json');

const pgPasswd = pgConfig.passwd ? `"${pgConfig.passwd}"` : 'null';
const pgPasswd_test_env = testEnvSetup.pgConfig.passwd ? `"${testEnvSetup.pgConfig.passwd}"` : 'null';

if (fs.existsSync(filename)) {
  fs.unlinkSync(filename);
}

fs.writeFileSync(
  filename,
  `{
    "development": {
      "username": "${pgConfig.user}",
      "password": ${pgPasswd},
      "database": "${pgConfig.db}",
      "host": "${pgConfig.host}",
      "port": "${pgConfig.port}",
      "dialect": "postgres"
    },
    "test": {
      "username": "${testEnvSetup.pgConfig.user}",
      "password": ${pgPasswd_test_env},
      "database": "${testEnvSetup.pgConfig.db}",
      "host": "${testEnvSetup.pgConfig.host}",
      "port": "${testEnvSetup.pgConfig.port}",
      "dialect": "postgres"
    },
    "production": {
      "username": "${pgConfig.user}",
      "password": ${pgPasswd},
      "database": "${pgConfig.db}",
      "host": "${pgConfig.host}",
      "port": "${pgConfig.port}",
      "dialect": "postgres"
  }
}`,
);