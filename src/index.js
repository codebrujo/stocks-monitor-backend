// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const https = require('https')
const fs = require('fs')
const { port, env } = require('./config/constants');
const logger = require('./config/logger');
const app = require('./config/express');
const { seedAll } = require('./seeds')

if (env === 'production') {
  // listen to requests
  app.listen(port, () => {
    const msg = `server started on port ${port} (http) (${env})`;
    logger.info(msg)
    console.log(msg);
  });
} else {
  const httpsOptions = {
    key: fs.readFileSync('./src/security/cert.key'),
    cert: fs.readFileSync('./src/security/cert.pem')
  }
  https.createServer(httpsOptions, app)
    .listen(port, () => {
      const msg = `server started on port ${port} (https) (${env})`;
      logger.info(msg);
      console.log(msg);
    });
}

require('./workers');

seedAll();

/**
 * Exports express
 * @public
 */
module.exports = app;