const chalk = require('chalk');
import {Level, Logger} from 'src/domain/logger';
import {format} from 'date-fns';

const levelColor = {
  silly: chalk.gray.bold,
  debug: chalk.magentaBright.bold,
  verbose: chalk.blackBright.bold,
  info: chalk.blueBright.bold,
  warn: chalk.yellowBright.bold,
  error: chalk.redBright.bold,
};

export class ChalkLogger implements Logger {
  log(
    level: Level,
    message: string,
    meta: {[key: string]: unknown} = {}
  ): void {
    const {service, ...rest} = meta;
    const logDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSSxxx');
    console.log(
      `${levelColor[level](
        '[' + level.toLocaleUpperCase() + ']'
      )} ${logDate} ${chalk.bold.cyanBright(service)} ${message}${
        Object.keys(rest).length
          ? '\n' + chalk.italic.gray(JSON.stringify(rest))
          : ''
      }`
    );
  }
}
