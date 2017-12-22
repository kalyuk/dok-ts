import { defaultsDeep } from 'lodash';
import { BaseService } from '../base';

export class WebResponseService extends BaseService {
  public static types = {
    html: 'text/html',
    json: 'application/json'
  };

  public static defaultConfig = {
    body: '',
    headers: {
      'Content-Encoding': 'UTF-8',
      'Content-Type': WebResponseService.types.json
    },
    statusCode: 200
  };

  public static renderError(statusCode: number, errors: any[], message: string) {
    return {
      body: JSON.stringify({
        statusCode,
        errors,
        message
      }),
      headers: {
        'Content-Type': WebResponseService.types.json
      },
      statusCode
    };
  }

  public render(response, content) {
    const data = content.body ? content : {body: content};
    const result = defaultsDeep(data, this.config);

    if (result.statusCode === 301 || result.statusCode === 302) {
      response.statusCode = result.statusCode;
      response.setHeader('Location', result.body);
      response.setHeader('Content-Type', 'plain/text');
      return response.end();
    }

    const body = typeof result.body === 'object' ? JSON.stringify(result.body) : result.body;

    if (typeof result.body === 'object') {
      response.setHeader('Content-Type', WebResponseService.types.json);
    }

    Object.keys(result.headers || {}).forEach((headerName) => {
      if (typeof result.headers[headerName] === 'string') {
        response.setHeader(headerName, result.headers[headerName]);
      } else {
        (result.headers[headerName]).forEach((data) => {
          response.setHeader(headerName, data);
        });
      }
    });

    response.statusCode = result.statusCode;
    response.setHeader('Content-Length', Buffer.byteLength(body).toString());
    response.write(body);
    return response.end();
  }
}