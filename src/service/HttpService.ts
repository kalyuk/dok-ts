import * as http from 'http';
import { LOG_LEVEL, LogService } from './LogService';
import { WebResponseService } from './WebResponseService';
import { parse, URL } from 'url';
import * as q from 'querystring';
import { BaseContext, BaseService } from '../base';
import { di } from '../decorator';

@di('LogService', 'ResponseService')
export class HttpService extends BaseService {
  public static defaultConfig = {
    host: '0.0.0.0',
    maxPostBodyLen: 1e6,
    port: 1987,
    schema: 'http',
    timeout: 30
  };

  private loggerService: LogService;
  private responseService: WebResponseService;
  private server: http.Server;

  public async init() {
    super.init();
    this.server = http.createServer();
    this.server.timeout = this.config.timeout * 1000;

    await new Promise((resolve) => {
      this.server.listen(this.config.port, this.config.host, resolve);
    });

    this.loggerService.render(LOG_LEVEL.INFO, `==> Listening on port ${this.config.port}.`);

    return this;
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
    const $url = new URL(this.config.scale + '://' + request.headers.host);
    const ctx = new BaseContext({
      hostname: $url.hostname,
      headers: request.headers,
      method: request.method,
      url: u.pathname,
      ip: (request.headers['x-forwarded-for'] || '').split(',')[0] || request.connection.remoteAddress
    });

    if (u.query) {
      ctx.get('route').params = q.parse(u.query as string);
    }

    this.readBody(ctx, request)
      .then(() => {
        return callback(ctx);
      })
      .catch((e) => {
        const body: any = {};
        const statusCode = e.code && Number.isInteger(e.code) ? e.code : 500;

        body.statusCode = statusCode;
        body.body = e.message;
        body[statusCode < 300 ? 'data' : 'errors'] = e.fields || {};

        return {
          body: JSON.stringify(body),
          headers: {
            'Content-Type': WebResponseService.types.json
          },
          statusCode
        };
      })
      .then((data) => {
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
                ctx.set('body', q.parse(body));
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