import { BaseService } from '../base/BaseService';
import * as http from 'http';
import { LOG_LEVEL, LoggerService } from './LoggerService';
import { BaseContext } from '../base/BaseContext';
import { parse, URL } from 'url';
import * as q from 'querystring';
import { ActionResult } from '../base/BaseController';
import { ResponseService } from './ResponseService';

export class HttpService extends BaseService {
  public static options = {
    host: '0.0.0.0',
    maxPostBodyLen: 1e6,
    port: 1987,
    timeout: 30
  };

  private server: http.Server;

  constructor(private responseService: ResponseService,
              private loggerService: LoggerService) {
    super();
  }

  public init() {
    super.init();
    this.server = http.createServer();
    this.server.timeout = this.config.timeout * 1000;
    return new Promise((resolve) => {
      this.server.listen(this.config.port, this.config.host, resolve);
    }).then(() => {
      const MESSAGE = `==> Listening on port ${this.config.port}. Open up http://${this.config.host}:${this.config.port}/ in your browser.`;
      this.loggerService.render(LOG_LEVEL.INFO, MESSAGE);
    });
  }

  public onClose(callback) {
    this.server.on('close', callback);
  }

  public onRequest(callback) {
    this.server.on('request', (request: http.IncomingMessage, response: http.ServerResponse) => {
      return this.execute(request, response, callback);
    });
  }

  public execute(request, response, callback) {

    const u = parse(request.url);
    const $url = new URL('http://' + request.headers.host);
    const ctx = new BaseContext({
      hostname: $url.hostname,
      headers: request.headers,
      method: request.method,
      url: u.pathname,
      ip: (request.headers['x-forwarded-for'] || '').split(',')[0] || request.connection.remoteAddress
    });

    if (u.query) {
      ctx.get().route.params = q.parse(u.query);
    }

    this.readBody(ctx, request)
      .then(() => {
        return callback(ctx);
      })
      .catch((e) => {
        const body: ActionResult = {};
        const statusCode = e.code && Number.isInteger(e.code) ? e.code : 500;

        body.statusCode = statusCode;
        body.body = e.message;
        body[statusCode < 300 ? 'data' : 'errors'] = e.fields || {};

        return {
          body: JSON.stringify(body),
          headers: {
            'Content-Type': ResponseService.types.json
          },
          statusCode
        };
      })
      .then((data) => {
        if (data.filePath) {
          return this.responseService.renderFile(response, data);
        }
        return this.responseService.render(response, data);
      });
  }

  private readBody(ctx: BaseContext, request: http.IncomingMessage) {
    return new Promise((resolve) => {
      if (request.method === 'POST' || request.method === 'PUT') {
        let body = '';
        request.on('data', (data) => {
          body += data;
          if (body.length > this.config.maxPostBodyLen) {
            request.connection.destroy();
          }
        });
        request.on('end', () => {
          const type = (request.headers['content-type'] as string).split(';')[0];
          switch (type) {
            case 'application/json':
              ctx.set('body', JSON.parse(body));
              break;
            default:
              if (body && body.length) {
                ctx.set(body, q.parse(body));
              }
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
