// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const https = require('https')
const fs = require('fs')
const { port, env } = require('./config/constants');
const logger = require('./config/logger');
const app = require('./config/express');


if (env === 'production') {
  // listen to requests
  app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
} else {
  const httpsOptions = {
    key: fs.readFileSync('./src/security/cert.key'),
    cert: fs.readFileSync('./src/security/cert.pem')
  }
  https.createServer(httpsOptions, app)
    .listen(port, () => {
      logger.info(`server started on port ${port} (${env})`);
    });
}

require('./workers');

/**
 * Exports express
 * @public
 */
module.exports = app;