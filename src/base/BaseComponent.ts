import { defaultsDeep } from 'lodash';

export class BaseComponent {

  public static defaultConfig = {};

  public config: any = {};

  constructor() {
    this.pre();
  }

  protected deepConfigure(constructor) {
    let config = {...constructor.defaultConfig} || {};
    if (constructor.__proto__.name) {
      config = defaultsDeep(config, this.deepConfigure(constructor.__proto__));
    }
    return config;
  }

  public configure(config) {
    this.config = defaultsDeep(config, this.getConfig(), this.deepConfigure(this.constructor));
  }

  // tslint:disable-next-line
  public pre() {

  }

  public getConfig() {
    return this.config;
  }
}
