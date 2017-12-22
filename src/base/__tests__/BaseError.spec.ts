import * as assert from "assert";
import { BaseError } from '../BaseError';

describe('BaseError', () => {
  it('should be return current code', () => {
    const code = 401;
    const message = 'global.invalid_token';
    try {
      throw new BaseError(code, message)
    } catch (e) {
      assert.equal(code, e.code);
    }
  });

  it('should be return current messae', () => {
    const code = 401;
    const message = 'global.invalid_token';
    try {
      throw new BaseError(code, message)
    } catch (e) {
      assert.equal(message, e.message);
    }
  })
});