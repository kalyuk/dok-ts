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
    const result = defaultsDeep(content, this.config);

    if (result.statusCode === 301 || result.statusCode === 302) {
      response.statusCode = result.statusCode;
      response.setHeader('Location', result.body);
      response.setHeader('Content-Type', 'plain/text');
      return response.end();
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
    response.setHeader('Content-Length', Buffer.byteLength(result.body).toString());
    response.write(result.body);
    return response.end();
  }
}