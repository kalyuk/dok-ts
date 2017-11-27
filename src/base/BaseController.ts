import { BaseModule } from './BaseModule';
import * as path from 'path';
import { getService } from '../index';
import { ResponseService } from '../services/ResponseService';

export interface Headers {
  [propName: string]: string | string[];
}

export interface ActionResult {
  statusCode?: number;
  body?: string;
  filePath?: string;
  headers?: Headers;
}

export interface BaseControllerInterface {
  init(id: string, module: BaseModule);

  getBehaviors(): any[];

  render(statusCode: number, body: string, headers: Headers): ActionResult;
}

export class BaseController implements BaseControllerInterface {
  public module: BaseModule;
  public id: string;

  public init(id: string, module: BaseModule) {
    this.module = module;
    this.id = id;
  }

  public getBehaviors() {
    return [];
  }

  public render(statusCode, body, headers?) {
    return {
      statusCode,
      body,
      headers
    };
  }

  public renderPUG(status: number, template: string, data?: any): ActionResult {
    const viewPath = path.join(this.module.getId(), this.id, template);
    return this.render(
      status,
      getService('PugService').render(viewPath, data),
      {
        'Content-Type': ResponseService.types.html
      }
    );
  }
}
