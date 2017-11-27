import { BaseComponent, BaseComponentConfig } from './BaseComponent';
import { ActionResult, BaseController } from './BaseController';
import * as path from 'path';
import * as fs from 'fs';
import { ucFirst } from '../helpers/string';
import { inject } from '../helpers/fn';
import { BaseContext } from './BaseContext';
import { BaseError } from './BaseError';

export interface BaseModuleConfig extends BaseComponentConfig {
  controller?: {
    dirName?: string
    ext?: string
  };
}

export interface BaseModuleInterface {
  id: string;
  controllers: { [key: string]: BaseController };

  getId(): string;

  // TODO change to response
  runAction(ctx: BaseContext): Promise<ActionResult>;
}

export class BaseModule extends BaseComponent implements BaseModuleInterface {
  public static options: BaseModuleConfig = {
    controller: {
      dirName: 'controllers',
      ext: '.ts'
    }
  };

  public controllers = {};

  public readonly id: string;

  private static async runBehaviors(ctx: BaseContext, controller: BaseController) {
    const behaviors = controller.getBehaviors();

    for (const behavior of behaviors) {
      if (!behavior.actions || behavior.actions.indexOf(ctx.get().route.actionName) !== -1) {
        await behavior.behavior(ctx, behavior.options);
      }
    }
  }

  public getId(): string {
    if (!this.config.id && !this.id) {
      throw new BaseError(500, `id not set in ${this.getClassName()}`);
    }
    return this.config.id || this.id;
  }

  public async runAction(ctx: BaseContext) {
    const route = ctx.get().route;
    const controller = this.getController(route.controllerName);
    if (!controller[route.actionName + 'Action']) {
      throw new BaseError(500, `Method ${route.actionName}Action in controller '${route.controllerName}' not found`);
    }

    await BaseModule.runBehaviors(ctx, controller);

    return controller[route.actionName + 'Action'](ctx);
  }

  private getController(controllerName: string) {
    if (!this.controllers[controllerName]) {
      const fullControllerName = ucFirst(controllerName) + 'Controller';
      const controllerPath = this.getControllerPath(fullControllerName);
      if (fs.existsSync(controllerPath)) {
        const INSTANCE = (require(controllerPath)[fullControllerName]);

        const args = inject(INSTANCE);

        this.controllers[controllerName] = new INSTANCE(...args);
        this.controllers[controllerName].init(controllerName, this);

      } else {
        throw new BaseError(500, `Controller ${controllerName} in ${this.getId()} not found`);
      }
    }
    return this.controllers[controllerName];
  }

  private getControllerPath(controllerName: string): string {
    return path.join(
      this.getPath(),
      this.config.controller.dirName,
      controllerName + this.config.controller.ext);
  }

}
