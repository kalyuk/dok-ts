import { each } from 'async';
import * as Validator from 'validator';

export interface AttributeErrorInterface {
  rule: string;
  message: string;
}

export class BaseModel<T> {

  private $errors: Map<string, AttributeErrorInterface> = new Map();

  public addError(attr, error: AttributeErrorInterface) {
    this.$errors.set(attr, error);
  }

  public attributes() {
    return Object.getOwnPropertyNames(this).filter((attr) => attr[0] !== '$');
  }

  public async afterValidate(): boolean {
    return true;
  }

  public async beforeValidate(): boolean {
    return true;
  }

  public clearErrors() {
    this.$errors.clear();
  }

  public isBoolean(attr): boolean {
    if (this[attr] === 'true') {
      this[attr] = true;
    } else if (this[attr] === 'false') {
      this[attr] = false;
    }
    return typeof this[attr] === 'boolean';
  }

  public required(attr): boolean {
    return this[attr] !== null && this[attr].length;
  }

  public hasErrors(): boolean {
    return this.$errors.size > 0;
  }

  public hasAttr(attr): boolean {
    return this[attr] !== undefined && typeof this[attr] !== 'function';
  }

  public setAttribute() {
    if (this.hasAttr(attr)) {
      this[attr] = value;
    }
  }

  public async validate(): boolean {
    if (await this.beforeValidate()) {
      return new Promise((resolve, reject) => {
        each(this.getRules(), (rule, callback) => {
          each(rule[0], async (attr, $callback) => {
            if (
              (this[rule[1]] && !await this[rule[1]](attr))
              || (!this[rule[1]] && Validator[rule[1]] && !Validator[rule[1]](`${this[attr]}`, rule[2] || {}))
            ) {
              this.addError(attr, rule[1], rule[2].message);
            }
            $callback();
          }, callback);
        }, async (err) => {
          if (err) {
            throw new Error(err);
          }
          if (await this.afterValidate()) {
            return resolve(true);
          }
          return reject();
        });
      });
    }

  }

  public getErrors() {
    return this.$errors.values();
  }

  public getRules(): [[string[], string, {[key: string]: any}]] {
    return [];
  }

  public getValues() {
    const data = {};

    this.attributes()
      .forEach((attr) => {
        data[attr] = this[attr];
      });

    return data;
  }
}
