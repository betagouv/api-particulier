type Level = 'silly' | 'debug' | 'verbose' | 'info' | 'warn' | 'error';

export interface Logger {
  log(level: Level, message: string, meta?: {[key: string]: unknown}): void;
}

let logger: Logger = {
  log(level: Level, message: string, meta: {[key: string]: unknown}) {
    const {service, ...rest} = meta;
    if (process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
      console.log(
        `[${service}] - ${level} - ${message} - ${JSON.stringify(rest)}`
      );
    }
  },
};

export const setInstance = (instance: Logger) => {
  logger = instance;
};

export const logFor = (service: string): Logger => ({
  log(level: Level, message: string, meta = {}) {
    logger.log(level, message, {...meta, service});
  },
});
