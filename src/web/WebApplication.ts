import { BaseApplication } from '../base/BaseApplication';
import { HttpService } from '../service/HttpService';
import { WebResponseService } from '../service/WebResponseService';
import { di } from '../decorator/di';
import { BaseContext } from '../base/BaseContext';

@di('HttpService')
export class WebApplication extends BaseApplication {
  public static defaultConfig = {
    services: {
      HttpService: {
        func: HttpService
      },
      WebResponseService: {
        func: WebResponseService
      }
    }
  };

  private httpService: HttpService;

  public listen() {
    this.init();
    this.httpService.onRequest((ctx: BaseContext) => {
      return this.runRoute(ctx);
    });
  }
}
