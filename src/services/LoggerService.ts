import { BaseService } from '../base/BaseService';

export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  RENDER: 4
};


export class LoggerService extends BaseService {
  public static options = {
    logLevel: LOG_LEVEL.INFO
  };

  public render(type, ...args) {
    if (this.config.logLevel <= type) {
      console.log.apply(console, args);
    }
  }
}
