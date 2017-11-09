const cache: any = {};

export function setApplication(application) {
  if (cache.application) {
    throw new Error('The application is already running');
  }
  cache.application = application;
}

export function getApplication() {
  return cache.application;
}

export function getService(name) {
  return getApplication().getService(name);
}
