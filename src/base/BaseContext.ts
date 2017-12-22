import { RouteInterface } from '../service';

export interface BaseContextInterface {
  body?: {[key: string]: string | string[]};
  hostname?: string;
  headers?: {[propName: string]: string | string[]};
  url?: string;
  payload?: any;
  method?: string;
  ip?: string;
  route?: RouteInterface;
}

export class BaseContext {
  private context: BaseContextInterface = {
    body: {},
    route: {},
    hostname: '',
    headers: {},
    url: '',
    payload: {},
    method: ''
  };

  constructor(context: BaseContextInterface) {
    this.context = {
      ...this.context,
      ...context
    };
  }

  public set(key: string, value: any) {
    this.context[key] = value;
  }

  public get(name?: string) {
    if (name) {
      return this.context[name];
    }
    return this.context;
  }

}