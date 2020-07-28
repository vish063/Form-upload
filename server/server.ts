import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import utils from './helpers/utils';
import * as path from 'path';
import Logger from './helpers/logger';
import errorMiddleware from './middleware/error.middleware';
import contactUsController from './api/contact-us/contactUs.controller';
const PORT: string = utils.getEnvVariable('PORT', true);
class Server {
  private static application: express.Application;
  private static __instance: any;
  private static init = (): void => {
    Server.application = express();
    Server.initializeMiddlewares();
    Server.initializeControllers();
    Server.handleBadRoutes();
    Server.initializeErrorHandling();
  };
  public static start = (): void => {
    Server.init();
    Server.__instance = Server.application.listen(PORT, () => {
      Logger.info(`App listening on the port ${PORT}`);
    });
  };

  public static stop = async (): Promise<Error | void> =>
    Server.__instance.close();
  public static getInstance = (): any => Server.__instance;

  private static initializeMiddlewares = (): void => {
    Server.application.use(bodyParser.json());
    Server.application.use(bodyParser.urlencoded({ extended: true }));
    Server.application.use(cookieParser());
    Server.application.use(express.static(path.join(process.cwd(), 'client')));
  };

  private static initializeErrorHandling = (): void => {
    // @ts-ignore
    Server.application.use(errorMiddleware);
  };

  private static initializeControllers = (): void => {
    const contactUs: contactUsController = contactUsController.getInstance();
    Server.application.use('/', contactUs.router);
  };

  private static handleBadRoutes = (): void => {
    // @ts-ignore
    Server.application.use((request: any, response: any): void => {
      Logger.debug(`request url is ${request.url}`);
      const res = "Sorry, can't find that!";
      Logger.debug(`Response - ${res} `);
      response.status(404).send(res);
    });
  };
}

export default Server;
