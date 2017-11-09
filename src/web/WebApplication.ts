import { BaseApplication } from '../base/BaseApplication';
import { HttpService } from '../services/HttpService';
import { ResponseService } from '../services/ResponseService';
import { PugService } from '../services/PugService';
import { BaseContext } from '../base/BaseContext';

export class WebApplication extends BaseApplication {
  public static options = {
    services: {
      HttpService: {
        func: HttpService
      },
      ResponseService: {
        func: ResponseService
      },
      PugService: {
        func: PugService
      }
    }
  };

  private httpService: HttpService;

  public init() {
    super.init();
    this.httpService = this.getService('HttpService');
  }

  public listen() {
    this.init();
    this.httpService.onRequest((ctx: BaseContext) => {
      return this.runRoute(ctx);
    });
  }
}
