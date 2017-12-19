import { BaseService } from '../base/BaseService';

export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  RENDER: 4
};

export class LogService extends BaseService {
  public static defaultConfig = {
    logLevel: LOG_LEVEL.INFO
  };

  public render(logLevel, ...args) {
    if (this.config.logLevel <= logLevel) {
      console.log.apply(console, args);
    }
  }
}