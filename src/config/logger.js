const winston = require('winston');
const { consoleFormat } = require("winston-console-format");
const { combine, timestamp, prettyPrint, colorize, padLevels } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.File({ filename: 'combined.log' }));
  logger.add(new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      padLevels(),
      consoleFormat({
        showMeta: true,
        metaStrip: ["timestamp", "service"],
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
          compact: Infinity,
        },
      })
    ),
  }));
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

/*global module*/
/*eslint no-undef: ["error", { "typeof": true }] */
module.exports = logger;