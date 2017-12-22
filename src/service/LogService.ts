import { BaseService } from '../base';

export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  RENDER: 4
};

export class LogService extends BaseService {
  public static defaultConfig = {
    logLevel: LOG_LEVEL.INFO,
    logger: console.log
  };

  public render(logLevel, ...args: any[]) {
    if (this.config.logLevel <= logLevel) {
      this.config.logger(...args);
    }
  }
}