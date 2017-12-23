import { BaseContext, BaseService } from '../base';
import { di } from '../decorator';
import { RouteService } from './RouteService';

@di('RouteService')
export class CorsService extends BaseService {
  public static defaultConfig = {
    headers: (ctx: BaseContext) => ({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization'
    })
  };

  private routeService: RouteService;

  public init() {
    this.routeService.add('.*?', 'OPTIONS', this.actionCors);
    super.init();
  }

  public actionCors = (ctx: BaseContext) => {
    return {
      statusCode: 204,
      headers: this.getHeaders(ctx)
    };
  }

  public getHeaders(ctx) {
    return this.config.headers(ctx);
  }
}