// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/constants');
const logger = require('./config/logger');
const app = require('./config/express');

// listen to requests
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

require('./workers');

/**
 * Exports express
 * @public
 */
module.exports = app;