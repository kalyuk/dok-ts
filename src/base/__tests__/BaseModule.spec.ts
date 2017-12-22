import * as assert from 'assert';
import { BaseModule } from '../BaseModule';

describe('BaseModule', () => {
  it('should be return configure from getConfig', () => {
    const module = new BaseModule();
    const config = {a: 'b', b: {c: 'd'}};
    module.configure(config);
    assert.deepEqual(config, module.getConfig())
  });

  it('should be return module id from config', () => {
    const module = new BaseModule();
    const id = 'BaseModule';
    module.configure({id});
    assert.equal(id, module.getId())
  });

  it('should be return module id from default', () => {
    const module = new BaseModule();
    assert.equal('BaseModule', module.getId())
  })
});