import { BaseService } from '../base/BaseService';
import { LOG_LEVEL, LoggerService } from './LoggerService';
import { ActionResult } from '../base/BaseController';

export class ResponseConsoleService extends BaseService {
  constructor(private loggerService: LoggerService) {
    super();
    this.loggerService = loggerService;
  }

  public render(data: ActionResult) {
    return this.loggerService.render(LOG_LEVEL.RENDER, data.body);
  }
}
