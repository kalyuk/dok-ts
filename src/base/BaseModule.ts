import { BaseComponent } from './BaseComponent';
import { BaseError } from './BaseError';

export class BaseModule extends BaseComponent {
  public readonly id: string = 'BaseModule';

  public getId(): string {
    if (!this.config.id && !this.id) {
      throw new BaseError(500, 'id not set in module');
    }
    return this.config.id || this.id;
  }
}