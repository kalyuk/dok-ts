import { BaseApplication } from '../base/BaseApplication';
import { BaseContext } from '../base/BaseContext';
import { ResponseConsoleService } from '../services/ResponseConsoleService';

export class ConsoleApplication extends BaseApplication {
  public static options = {
    services: {
      ResponseService: {
        func: ResponseConsoleService
      }
    }
  };

  public async run() {
    super.init();
    const ctx = new BaseContext({
      method: 'COMMAND',
      url: (this.arguments.route) as string
    });

    const content = await this.runRoute(ctx);

    this.getService('ResponseService').render(content);

    process.exit();
  }
}
