import { RouteInterface } from '../services/RouteService';

export interface BaseContextInterface {
  body?: { [key: string]: string | string[] };
  content?: string;
  hostname?: string;
  headers?: { [propName: string]: string | string[] };
  url?: string;
  route?: RouteInterface;
  payload?: any;
  method?: string;
  ip?: string;
}

export class BaseContext {

  private context: BaseContextInterface = {
    body: {},
    content: '',
    hostname: '',
    headers: {},
    url: '',
    route: {},
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

  public get() {
    return this.context;
  }
}
