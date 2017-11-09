import { BaseModule } from '../base/BaseModule';

export class StaticModule extends BaseModule {
  public static options = {
    basePath: __dirname,
    controller: {
      ext: '.js'
    }
  };
  public readonly id = 'StaticModule';
}
