import { ucFirst } from './string';
import { getService } from '../index';

export function getFnParamNames(fn: Function): string[] {
  const fstr = fn.toString();
  if (fstr.match(/function.*?\(.*?\)/)) {
    return fstr.match(/\(.*?\)/)[0]
      .replace(/[()]/gi, '')
      .replace(/\s/gi, '')
      .split(',');
  }
  return [];
}

export function inject(INSTANCE) {
  const args = [];
  getFnParamNames(INSTANCE).forEach((serviceName) => {
    if (serviceName && serviceName.length) {
      args.push(getService(ucFirst(serviceName)));
    }
  });
  return args;
}
