import { defaultsDeep } from 'lodash';
import { BaseError } from './BaseError';

export interface BaseComponentConfig {
  [propName: string]: any;
}

export interface BaseComponentInterface {

  configure(config: BaseComponentConfig);

  init();

  getPath(): string;

  getClassName(): string;
}

export class BaseComponent implements BaseComponentInterface {
  public static options = {};
  public config: BaseComponentConfig;

  // tslint:disable-next-line
  public init() {
  }

  public getPath(): string {
    if (!this.config.basePath) {
      throw new BaseError(500, `path not set in ${this.getClassName()}`);
    }
    return this.config.basePath;
  }

  public configure(config: BaseComponentConfig) {
    this.config = defaultsDeep(config, this.config, this.deepConfigure(this.constructor));
  }

  protected deepConfigure(constructor): BaseComponentConfig {
    let config: BaseComponentConfig = {...constructor.options} || {};
    if (constructor.__proto__.name) {
      config = defaultsDeep(config, this.deepConfigure(constructor.__proto__));
    }
    return config;
  }

  public getClassName() {
    return (this as any).constructor.name;
  }
}
