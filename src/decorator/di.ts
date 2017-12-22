import { getService } from '..';

export function di(...services: string[]) {
  return (target) => {
    Object.defineProperty(target.prototype, '$inject', {
      value: () => {
        // tslint:disable-next-line
        services.forEach(function (serviceName) {
          Object.defineProperty(target.prototype, serviceName[0].toLowerCase() + serviceName.substr(1), {
            value: getService(serviceName)
          });
        });
      }
    });
    return target;
  };
}