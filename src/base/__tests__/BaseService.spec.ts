import * as assert from "assert";
import { BaseService } from '../BaseService';

describe('BaseService', () => {
  it('should be have init function', () => {
    const service = new BaseService();
    assert.equal('function', typeof service.init);
  });

});