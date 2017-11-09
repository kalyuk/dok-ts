import { WebController } from '../../web/WebController';
import { BaseContext } from '../../base/BaseContext';
import * as path from 'path';
import { ActionResult } from '../../base/BaseController';

export class IndexController extends WebController {

  public indexAction(context: BaseContext): ActionResult {
    const ctx = context.get();
    const filePath = path.join(ctx.route.props.viewPath, (ctx.route.params.filePath as string).split('?')[0]);
    const fp = path.normalize(filePath);
    if (fp.split(ctx.route.props.viewPath).length === 1) {
      throw new Error('Did`n have permissions');
    }
    return this.renderFile(filePath);
  }
}
