import { each } from 'async';
import * as Validator from 'validator';

export interface AttributeErrorInterface {
  rule: string;
  message: string;
}

export interface RuleIterface {
  fields: string[];
  rule: string;
  options?: { [key: string]: any };
}

export class BaseModel {
  private $errors: Map<string, AttributeErrorInterface> = new Map();

  public addError(attr, error: AttributeErrorInterface) {
    this.$errors.set(attr, error);
  }

  public attributes() {
    return Object.getOwnPropertyNames(this).filter((attr) => attr[0] !== '$');
  }

  public async afterValidate(): Promise<boolean> {
    return true;
  }

  public async beforeValidate(): Promise<boolean> {
    return true;
  }

  public clearErrors() {
    this.$errors.clear();
  }

  public isBoolean(attr: string): boolean {
    if ((this as any)[attr] === 'true') {
      (this as any)[attr] = true;
    } else if ((this as any)[attr] === 'false') {
      (this as any)[attr] = false;
    }
    return typeof (this as any)[attr] === 'boolean';
  }

  public required(attr: string): boolean {
    return (this as any)[attr] !== null && this[attr].length;
  }

  public hasErrors(): boolean {
    return this.$errors.size > 0;
  }

  public hasAttr(attr): boolean {
    return (this as any)[attr] !== undefined && typeof (this as any)[attr] !== 'function';
  }

  public setAttribute(attr: string, value: any): void {
    if (this.hasAttr(attr)) {
      (this as any)[attr] = value;
    }
  }

  public load(values = {}) {
    this.attributes().forEach((attr) => {
      if (values[attr]) {
        this.setAttribute(attr, values[attr]);
      }
    });
  }

  public async validate(scope: string = 'default') {
    if (await this.beforeValidate()) {
      return new Promise((resolve, reject) => {
        each(this.getRules(), (rule: RuleIterface, callback) => {
          each(rule[0], async (attr: string, $callback) => {
            const value = this[attr] === null ? '' : this[attr];
            const isFunc = typeof rule[1] === 'function';
            if (!rule[2].scopes || (rule[2].scopes && rule[2].scopes.indexOf(scope) !== -1)) {
              if (
                (isFunc && await rule[1](value, attr, this, rule[2]))
                ||
                (!isFunc && this[rule[1]] && await this[rule[1]](attr))
                ||
                (!isFunc && !this[rule[1]] && Validator[rule[1]] && !Validator[rule[1]](value + '', rule[2] || {}))
              ) {
                this.addError(attr, {rule: rule[1], message: rule[2].message});
              }
            }
            $callback();
          }, callback);
        }, async (err) => {
          if (err) {
            throw new Error(err as string);
          }
          if (await this.afterValidate()) {
            return resolve(true);
          }
          return reject(false);
        });
      });
    }

  }

  public getErrors() {
    const errors = {};
    this.$errors.forEach((item, attr) => {
      errors[attr] = item.message;
    });
    return errors;
  }

  public getRules() {
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
