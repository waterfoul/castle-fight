const winston = require('winston');
const args = require('./args');

export const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      prettyPrint: true,
      colorize: true,
      timestamp: true,
      level: args.verbose >= 1 ? (args.verbose >= 2 ? 'debug' : 'info') : 'warn'
    }),
  ],
});
