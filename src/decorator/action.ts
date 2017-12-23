import { getService } from '../core';
import { MethodTypes, PropsType, RouteService } from '../service';

export interface Action {
  url: string;
  method?: MethodTypes;
  props?: PropsType;
  statusCode?: number;
}

export function action({url, method, props, statusCode}: Action) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const routeService: RouteService = getService('RouteService');

    descriptor.value.bind(target);
    routeService.add(url, method, descriptor.value, props);

    Reflect.defineMetadata('action:url', url, target, propertyKey);
    Reflect.defineMetadata('action:method', method.toLowerCase(), target, propertyKey);
    Reflect.defineMetadata('action:statusCode', statusCode, target, propertyKey);

  };
}

export function GET(url: string, props: PropsType = {}, statusCode = 200) {
  return action({url, method: 'GET', props, statusCode});
}

export function POST(url: string, props: PropsType = {}, statusCode = 200) {
  return action({url, method: 'POST', props, statusCode});
}

export function PUT(url: string, props: PropsType = {}, statusCode = 201) {
  return action({url, method: 'PUT', props, statusCode});
}

export function DELETE(url: string, props: PropsType = {}, statusCode = 200) {
  return action({url, method: 'DELETE', props, statusCode});
}

export function PATCH(url: string, props: PropsType = {}, statusCode = 200) {
  return action({url, method: 'PATCH', props, statusCode});
}

export function OPTIONS(url: string, props: PropsType = {}, statusCode = 201) {
  return action({url, method: 'OPTIONS', props, statusCode});
}