import * as assert from 'assert';
import { BaseComponent } from '../BaseComponent';

describe('BaseComponent', () => {
  it('should be return configure', () => {
    const component = new BaseComponent();
    const config = {a: 'b', b: {c: 'd'}};
    component.configure(config);
    assert.deepEqual(config, component.config)
  });

  it('should be return configure from getConfig', () => {
    const component = new BaseComponent();
    const config = {a: 'b', b: {c: 'd'}};
    component.configure(config);
    assert.deepEqual(config, component.getConfig())
  })
});