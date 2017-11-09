import { ActionResult, BaseController } from '../base/BaseController';
import { ResponseService } from '../services/ResponseService';

export class WebController extends BaseController {

  public renderFile(filePath: string): ActionResult {
    return {
      statusCode: 200,
      body: '',
      filePath
    };
  }

  public renderJSON(statusCode, json, code = 'success'): ActionResult {
    const data: any = {};

    if (statusCode > 300 && code === 'success') {
      throw new Error('Wrong response code');
    }

    data.code = code;
    data[statusCode < 300 ? 'data' : 'errors'] = json;

    return {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': ResponseService.types.json
      },
      statusCode
    };
  }
}
