import * as assert from 'assert';
import { BaseApplication } from '../BaseApplication';
import { removeApplication } from '../../index';

describe('BaseApplication', () => {
  it('should be return configure from getConfig', () => {
    const config = Object.assign({}, BaseApplication.defaultConfig, {a: 'b', b: {c: 'd'}});
    const application = new BaseApplication({default: config});
    assert.deepEqual(config, application.getConfig());
    removeApplication();
  });

  it('should be return link to application getModule', () => {
    const appId = 'testApp';
    const config = Object.assign({}, BaseApplication.defaultConfig, {id: appId});
    const application = new BaseApplication({default: config});
    const module = application.getModule(appId);
    assert.deepEqual(application, module);
    removeApplication();
  });

  it('should be return 500 error if module not found', () => {
    const application = new BaseApplication({});
    try {
      application.getModule('some name');
      assert.equal(1, 2);
    } catch (e) {
      assert.equal(500, e.code);
    }
    removeApplication();
  });

  it('should be get service', () => {
    const application = new BaseApplication({});
    try {
      application.getService('LogService');
    } catch (e) {
      assert.equal(1, 2);
    }
    removeApplication();
  });

  it('should be return 500 error if service not found', () => {
    const application = new BaseApplication({});
    try {
      application.getService('AService');
      assert.equal(1, 2);
    } catch (e) {
      assert.equal(500, e.code);
    }

    removeApplication();
  });
});