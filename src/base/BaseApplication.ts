import { BaseModule, BaseModuleConfig } from './BaseModule';
import { RouteService } from '../services/RouteService';
import { setApplication } from '../index';
import { defaultsDeep } from 'lodash';
import * as path from 'path';
import { inject } from '../helpers/fn';
import { LoggerService } from '../services/LoggerService';
import { BaseContext } from './BaseContext';
import { StaticModule } from '../modules/StaticModule';
import { BaseError } from './BaseError';

export interface BaseApplicationConfig extends BaseModuleConfig {
  boot?: string[];
  services?: { [propName: string]: any };
  modules?: { [propName: string]: any };
}

export class BaseApplication extends BaseModule {
  public static options: BaseApplicationConfig = {
    boot: [],
    services: {
      LoggerService: {
        func: LoggerService
      },
      RouteService: {
        func: RouteService
      }
    },
    modules: {
      StaticModule: {
        func: StaticModule
      }
    }
  };

  public arguments: { [propName: string]: string | number } = {
    env: 'development',
    port: 1987
  };

  constructor(configPath) {
    super();
    setApplication(this);

    process.argv.forEach((val) => {
      const tmp = val.split('=');
      this.arguments[tmp[0]] = tmp[1];
    });

    const configurations = require(configPath).default();
    const config = defaultsDeep(configurations[this.arguments.env] || {}, configurations.default);

    this.configure(config);
  }

  public getService(name) {
    return this.get('services', name);
  }

  public getModule(name) {
    if (name === this.getId()) {
      return this;
    }
    return this.get('modules', name);
  }

  public runRoute = async (ctx: BaseContext) => {
    await this.getService('RouteService').matchRoute(ctx);
    return this.getModule(ctx.get().route.moduleName || this.getId()).runAction(ctx);
  }

  public init() {
    super.init();
    this.config.boot.forEach((serviceName) => {
      this.getService(serviceName);
    });
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

      if (this.config[type][name].path) {
        const NAME = this.config[type][name].path.split(path.sep).pop();
        this.config[type][name].func = require(this.config[type][name].path)[NAME];
      }

      const INSTANCE = this.config[type][name].func;

      const args = inject(INSTANCE);

      this.config[type][name].$instance = args.length ? new INSTANCE(...args) : new INSTANCE();

      this.config[type][name].$instance.configure(this.config[type][name].options || {});
      this.config[type][name].$instance.init();
    }

    return this.config[type][name].$instance;
  }

}
