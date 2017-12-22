import { BaseService, BaseError, BaseContext } from '../base';

export type MethodTypes = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';
export type PropsType = {[key: string]: any};

export interface RouteInterface {
  method?: MethodTypes;
  url?: string;
  keyParams?: string[];
  regexp?: RegExp;
  params?: {[key: string]: string | string[] | number[]};
  props?: PropsType;
  action?: Function;
}

export class RouteService extends BaseService {
  public static defaultConfig = {
    routes: new Map<string, RouteInterface>()
  };

  public add(url: string, method: MethodTypes, action: Function, props: PropsType = {}) {
    const keyParams = [];
    url = url.replace(/<(.*?):(.*?)>/ig, (m, attr, key) => {
      keyParams.push(attr);
      return '(' + key + ')';
    });

    const regexp = new RegExp(`^${url}$`);

    this.config.routes.set(`${method} ${url}`, {url, method, action, props, keyParams, regexp, params: {}});
  }

  public matchRoute(context: BaseContext) {
    const ctx = context.get();
    this.config.routes.every((route) => {
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
          return false;
        }
      }
      return true;
    });

    if (!ctx.route.controllerName) {
      throw new BaseError(404, `Route: ${ctx.method} ${ctx.url} not found`);
    }
  }
}