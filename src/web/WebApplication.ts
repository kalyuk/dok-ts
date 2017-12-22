import { HttpService, WebResponseService } from '../service';
import { BaseApplication, BaseContext } from '../base';

export class WebApplication extends BaseApplication {
  public static defaultConfig = {
    services: {
      HttpService: {
        func: HttpService
      },
      ResponseService: {
        func: WebResponseService
      }
    }
  };

  private httpService: HttpService;

  public listen() {
    this.httpService.onRequest((ctx: BaseContext) => {
      return this.runRoute(ctx);
    });
  }
}
