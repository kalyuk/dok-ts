import { BaseModule } from './BaseModule';
import { defaultsDeep } from 'lodash';
import { BaseError } from './BaseError';
import { LogService, RouteService } from '../service';
import { setApplication } from '../';
import { BaseContext } from './BaseContext';

export class BaseApplication extends BaseModule {
  public static defaultConfig: any = {
    boot: [],
    services: {
      LogService: {
        func: LogService
      },
      RouteService: {
        func: RouteService
      }
    }
  };

  public arguments: {[propName: string]: string | number} = {
    env: 'development',
    port: 1987
  };

  constructor(configurations) {
    super();
    setApplication(this);
    process.argv.forEach((val) => {
      const tmp = val.split('=');
      this.arguments[tmp[0]] = tmp[1];
    });
    const config = defaultsDeep(configurations[this.arguments.env] || {}, configurations.default);
    this.configure(config);
  }

  public getService(name: string) {
    const service = this.get('services', name);

    if (!service.isInit) {
      service.init();
      service.isInit = true;
    }

    return service;
  }

  public getModule(name: string) {
    if (name === this.getId()) {
      return this;
    }
    return this.get('modules', name);
  }

  public runRoute = (ctx: BaseContext) => {
    this.getService('RouteService').matchRoute(ctx);
    return ctx.get('route').action(ctx);
  }

  private get(type: string, name: string) {
    if (!this.config[type]) {
      throw new BaseError(500, `${type}, not resolve`);
    }

    if (!this.config[type][name]) {
      throw new BaseError(500, `${type}: ${name},  not resolve`);
    }

    if (!this.config[type][name].$instance) {
      if (!this.config[type][name].path && !this.config[type][name].func) {
        throw new BaseError(500, `${type}: ${name},  undefined`);
      }

      const INSTANCE = this.config[type][name].func;
      this.config[type][name].$instance = new INSTANCE();
      this.config[type][name].$instance.configure(this.config[type][name].options || {});
    }

    return this.config[type][name].$instance;
  }
}