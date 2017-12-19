import { getService } from '../index';

export function di(...services: string[]) {
  return (target) => {
    // tslint:disable-next-line
    target.prototype.pre = function () {
      services.forEach((serviceName) => {
        (this as any)[serviceName[0].toLowerCase() + serviceName.substr(1)] = getService(serviceName);
      });
    };
    return target;
  };
}