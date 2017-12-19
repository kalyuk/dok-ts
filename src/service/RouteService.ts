import { BaseService } from '../base/BaseService';
import { BaseContext } from '../base/BaseContext';
import { BaseError } from '../base/BaseError';

export interface RouteInterface {
  method?: string;
  url?: string;
  keyParams?: string[];
  regexp?: RegExp;
  params?: { [key: string]: string | string[] | number[] };
  props?: { [key: string]: any };
}

export class RouteService extends BaseService {
  public static defaultConfig = {
    routes: new Map<string, RouteInterface>()
  };

  public matchRoute(ctx) {
    return this.matchRouteWithRoutes(ctx, this.config.routes);
  }

  public addRoute(route: RouteInterface) {

    route.url = route.url.replace(/<(.*?):(.*?)>/ig, (m, attr, key) => {
      routes[urlKey].keyParams.push(attr);
      return '(' + key + ')';
    });

    route.regexp = new RegExp(`^${route.url}$`);

    const key = route.method === 'ALL' ? '' : route.method + ' ';
    this.config.routes.set(key + route.url, route);
  }

  private matchRouteWithRoutes(context: BaseContext, routes) {
    const ctx = context.get();
    this.config.routes.forEach((route) => {
      if (route.method === ctx.method || route.method === 'ALL') {
        const match = ctx.url.match(route.regexp);
        if (match) {
          ctx.route.params = {
            ...ctx.route.params || {},
            ...route.params
          };
          ctx.route.props = route.props || {};

          route.keyParams.forEach((key, index) => {
            const value = match[index + 1];
            ctx.route.params[key] = decodeURIComponent(value);
          });

          break;
        }
      }
    });

    if (!ctx.route.controllerName) {
      throw new BaseError(404, `Route: ${ctx.method} ${ctx.url} not found`);
    }
  }
}