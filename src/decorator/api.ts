import { getApplication, getService } from '../core';
import { SwaggerPathDescription } from '../service/SwaggerService';
import { BaseContext } from '../base';
import { defaultsDeep } from 'lodash';
import { LOG_LEVEL, WebResponseService } from '../service';

export function api(params: SwaggerPathDescription = {}) {
  return (target: any, propertyKey: string) => {
    const url = Reflect.getMetadata('action:url', target, propertyKey);
    const method = Reflect.getMetadata('action:method', target, propertyKey);
    const $params = Reflect.getMetadata('swagger:params', target, propertyKey) || {};
    getService('SwaggerService').addPath(url, method, defaultsDeep($params, params));

  };
}

export function response(ref?: any | any[], statusCode?: number, headers: any = {}) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    statusCode = statusCode ? statusCode : Reflect.getMetadata('action:statusCode', target, propertyKey);
    const logService = getService('LogService');
    const corsService = getService('CorsService');
    const env = getApplication().arguments.env;
    const method = descriptor.value;
    method.bind(target);
    descriptor.value = async (ctx: BaseContext) => {
      try {
        const corsHeaders = await corsService.getHeaders(ctx);
        const body = await method(ctx);

        if (!headers['Content-Type']) {
          headers['Content-Type'] = WebResponseService.types[typeof body === 'object' ? 'json' : 'html'];
        }

        return {
          statusCode,
          headers: {...corsHeaders, ...headers},
          body: {
            data: typeof body === 'object' ? JSON.stringify(body) : body
          }
        };
      } catch (e) {
        if (e.code === 500 && env !== 'development') {
          logService.render(LOG_LEVEL.ERROR, e);
          return {
            body: {}
          };
        }
        return {
          headers,
          statusCode: e.code || 500,
          body: {
            message: e.message,
            errors: e.errors || []
          }
        };
      }
    };

  };
}
