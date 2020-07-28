import * as winston from 'winston';

class Logger {
  public static setLogger = (): winston.Logger =>
    winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.LOG_LEVEL || 'info',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            winston.format.printf(info => {
              const { timestamp, level, message, ...args } = info;
              return `${timestamp} [${level}]: ${message} ${
                Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
              }`;
            })
          ),
        }),
      ],
    });
}
export default Logger.setLogger();
