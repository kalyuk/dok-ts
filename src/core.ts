import { BaseError } from './base';

const cache: any = {};

export function setApplication(application) {
  if (cache.application) {
    throw new BaseError(500, 'The application is already running');
  }
  cache.application = application;
}

export function getApplication() {
  return cache.application;
}

export function removeApplication() {
  delete cache.application;
}

export function getService(name) {
  return getApplication().getService(name);
}