import { BaseService } from '../base/BaseService';
import { defaultsDeep } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as _mime from 'mime-type';
import * as db from 'mime-db';
import { ActionResult } from '../base/BaseController';

const mime = _mime(db);

export class ResponseService extends BaseService {
  public static types = {
    html: 'text/html',
    json: 'application/json'
  };

  public static options = {
    body: '',
    headers: {
      'Content-Encoding': 'UTF-8',
      'Content-Type': ResponseService.types.json
    },
    statusCode: 200
  };

  public static renderError(statusCode, errors, message): ActionResult {
    return {
      body: JSON.stringify({
        statusCode,
        errors,
        message
      }),
      headers: {
        'Content-Type': ResponseService.types.json
      },
      statusCode
    };
  }

  public renderFile(response, content) {
    if (!fs.existsSync(content.filePath)) {
      content.body = `File not found, ${content.filePath.split('/').pop()}`;
      content.status = 404;
      return this.render(response, content);
    }

    const ext = path.extname(content.filePath);
    let type;
    switch (ext) {
      case 'eot':
        type = 'application/vnd.ms-fontobject';
        break;
      case 'ttf':
        type = 'application/octet-stream';
        break;
      case 'svg':
        type = 'image/svg+xml';
        break;
      case 'woff':
        type = 'application/font-woff';
        break;
      case 'woff2':
        type = 'font/woff2';
        break;
      default:
        type = mime.lookup(content.filePath);
    }

    response.writeHead(200, {'Content-Type': type});

    fs.createReadStream(content.filePath).pipe(response);
    return null;
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
