import * as assert from 'assert';
import { LOG_LEVEL, LogService } from '../LogService';

describe('LogService', () => {

  it('should be change logger function', () => {
    const service = new LogService();
    let result: any = null;

    function logger(...args) {
      result = args;
    }

    service.configure({
      logger
    });

    service.render(LOG_LEVEL.INFO, 'info');

    assert.equal(logger, service.getConfig().logger);
  });

  it('should be render info text', () => {
    const service = new LogService();
    let result: any = null;
    service.configure({
      logger: (...args) => {
        result = args;
      }
    });

    service.render(LOG_LEVEL.INFO, 'info');

    assert.equal('info', result[0]);
  });

  it('should be render info text is empty', () => {
    const service = new LogService();
    let result: any = null;
    service.configure({
      logLevel: LOG_LEVEL.ERROR,
      logger: (...args) => {
        result = args;
      }
    });

    service.render(LOG_LEVEL.INFO, 'info');
    assert.equal(null, result);
  });

});