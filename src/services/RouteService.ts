import { BaseService } from '../base/BaseService';
import { getApplication } from '../index';
import { BaseContext } from '../base/BaseContext';
import { BaseError } from '../base/BaseError';

export interface RouteInterface {
  method?: string;
  url?: string;
  keyParams?: string[];
  regexp?: RegExp;
  params?: { [key: string]: string | string[] | number[] };
  props?: { [key: string]: any };
  actionName?: string;
  controllerName?: string;
  moduleName?: string;
}

export class RouteService extends BaseService {

  public static options = {
    routes: {}
  };

  public matchRoute(ctx) {
    return this.matchRouteWithRoutes(ctx, this.config.routes);
  }

  public init() {
    super.init();
    this.parseRoutes(this.config.routes);
  }

  private parseRoutes(routes: { [propName: string]: RouteInterface }) {
    Object.keys(routes).forEach((urlKey) => {
      routes[urlKey].keyParams = [];
      const splitedUrl = urlKey.split(' ');

      if (splitedUrl.length > 1) {
        routes[urlKey].method = splitedUrl[0].toUpperCase();
        routes[urlKey].url = splitedUrl[1];
      } else {
        routes[urlKey].method = 'ALL';
        routes[urlKey].url = splitedUrl[0];
      }

      routes[urlKey].url = routes[urlKey].url.replace(/<(.*?):(.*?)>/ig, (m, attr, key) => {
        routes[urlKey].keyParams.push(attr);
        return '(' + key + ')';
      });

      routes[urlKey].regexp = new RegExp(`^${routes[urlKey].url}$`);
    });
  }

  private matchRouteWithRoutes(context: BaseContext, routes) {
    const ctx = context.get();
    Object.keys(routes).some((urlKey) => {
      if (routes[urlKey].method === 'ALL' || routes[urlKey].method === ctx.method) {
        const match = ctx.url.match(routes[urlKey].regexp);
        if (match) {
          ctx.route.params = {
            ...ctx.route.params || {},
            ...routes[urlKey].params
          };

          ctx.route.props = routes[urlKey].props || {};

          routes[urlKey].keyParams.forEach((key, index) => {
            const value = match[index + 1];
            ctx.route.params[key] = decodeURIComponent(value);
          });

          ctx.route.actionName = routes[urlKey].actionName || ctx.route.params.actionName;
          ctx.route.controllerName = routes[urlKey].controllerName || ctx.route.params.controllerName;
          ctx.route.moduleName = routes[urlKey].moduleName || ctx.route.params.moduleName || getApplication().getId();

          return true;
        }
      }
      return false;
    });

    if (!ctx.route.controllerName) {
      throw new BaseError(404, `Route: ${ctx.method} ${ctx.url} not found`);
    }
  }
}
