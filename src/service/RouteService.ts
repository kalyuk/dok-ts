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

export interface RouteConfig {
  routes: {
    [key: string]: RouteInterface
  };
}

export class RouteService extends BaseService {
  public static defaultConfig: RouteConfig = {
    routes: {}
  };

  public add(url: string, method: MethodTypes, action: Function, props: PropsType = {}) {
    const keyParams = [];
    url = url.replace(/<(.*?):(.*?)>/ig, (m, attr, key) => {
      keyParams.push(attr);
      return '(' + key + ')';
    });

    const regexp = new RegExp(`^${url}$`);

    this.config.routes[`${method} ${url}`] = {url, method, action, props, keyParams, regexp, params: {}};
  }

  public matchRoute(context: BaseContext) {
    const ctx = context.get();
    Object.keys(this.config.routes)
      .every((key: string) => {
        const route = this.config.routes[key];
        if (route.method === ctx.method || route.method === 'ALL') {
          const match = ctx.url.match(route.regexp);
          if (match) {
            ctx.route = {...route};
            ctx.route.params = {
              ...ctx.route.params || {},
              ...route.params
            };
            ctx.route.props = route.props || {};

            route.keyParams.forEach((keyParam, index) => {
              const value = match[index + 1];
              ctx.route.params[keyParam] = decodeURIComponent(value);
            });
            return false;
          }
        }
        return true;
      });

    if (!ctx.route.action) {
      throw new BaseError(404, `Route: ${ctx.method} ${ctx.url} not found`);
    }
  }
}