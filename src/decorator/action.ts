import { getService } from '..';
import { PropsType, RouteService } from '../service';

export interface Action {
  url: string;
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  props?: PropsType;
}

export function action({url, method, props}: Action) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const routeService: RouteService = getService('RouteService');
    descriptor.value.bind(target);
    routeService.add(url, method, descriptor.value, props);
  };
}

export function GET(url: string, props: PropsType = {}) {
  return action({url, method: 'GET', props});
}

export function POST(url: string, props: PropsType = {}) {
  return action({url, method: 'POST', props});
}

export function PUT(url: string, props: PropsType = {}) {
  return action({url, method: 'PUT', props});
}

export function DELETE(url: string, props: PropsType = {}) {
  return action({url, method: 'DELETE', props});
}

export function PATCH(url: string, props: PropsType = {}) {
  return action({url, method: 'PATCH', props});
}