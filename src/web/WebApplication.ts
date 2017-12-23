import { HttpService, WebResponseService, SwaggerService, CorsService } from '../service';
import { BaseApplication, BaseContext } from '../base';
import { di } from '../decorator';

@di('HttpService')
export class WebApplication extends BaseApplication {
  public static defaultConfig = {
    services: {
      SwaggerService: {
        func: SwaggerService
      },
      CorsService: {
        func: CorsService
      },
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
