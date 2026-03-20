import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'data/logs/error.log', level: 'error' }),
    new transports.File({ filename: 'data/logs/combined.log' }),
  ],
});

export default logger;
