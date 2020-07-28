import { Router, Request, Response } from 'express';
import authMiddleware from '../../middleware/auth.middleware';
import Logger from '../../helpers/logger';
import * as fs from 'fs';
import {
  check,
  ValidationChain,
  ValidationError,
  validationResult,
} from 'express-validator';
import * as multer from 'multer';

import Jira from '../../helpers/jira';
import Email from '../../helpers/email';
import constants from '../../helpers/constants';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = './dist/files/';
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const limits = {
  fileSize: 2000000, // 2mb
  files: 10,
};
const upload = multer({ storage, limits });

class contactUsController {
  private static instance: contactUsController;
  public router: Router = Router();
  private constructor() {
    this.initializeRoutes();
  }
  private validateSaveContactForm = (): Array<ValidationChain> => {
    return [
      check('name', constants.validationErrors.REQUIRED).isLength({ min: 1 }),
      check('email', constants.validationErrors.EMAIL).isEmail(),
      check('area', constants.validationErrors.REQUIRED).isLength({ min: 1 }),
      check('comment', constants.validationErrors.REQUIRED).isLength({
        min: 1,
      }),
    ];
  };
  private initializeRoutes = (): void => {
    Logger.info('initialize');
    this.router.post(
      '/savecontactform',
      upload.any(),
      this.validateSaveContactForm(),
      this.saveContactForm
    );
    this.router.get('/health', authMiddleware, this.getHealth);
  };

  private saveContactForm = async (
    request: Request,
    response: Response
  ): Promise<Response | Error> => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const res: { errors: ValidationError[] } = { errors: errors.array() };
      Logger.error(JSON.stringify(res));
      return response.status(422).json(res);
    }
    const { name, email, comment, area } = request.body;
    const formData = {
      name,
      email,
      comment,
      area,
    };
    const files: string[] = [];
    // @ts-ignore
    for (const file of request.files) {
      files.push(file.path);
    }
    Logger.debug(`Requested url is ${request.url}`);
    Logger.debug(`Request body ${JSON.stringify(request.body)}`);
    try {
      const jira = Jira.getInstance();
   //   const jiraNumber = await jira.create(formData);
      if (files.length > 0) {
    //    await jira.uploadFiles(jiraNumber, files);
      }
    //  await Email.send(jiraNumber, formData, files);
      await contactUsController.deleteFiles(files);
      for (const key in formData) {
        delete formData[key];
      }
      const out: { status: string } = { status: 'Mail Sent Successfully' };
      Logger.debug(`Response ${JSON.stringify(out)}`);
      response.send(out);
    } catch (e) {
      Logger.error(`Error ${e}`);
      response.send(e);
    }
  };
  private getHealth = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    Logger.debug(`request url is ${request.url}`);
    response.send('Success!!');
  };
  public static deleteFiles = async (
    files: string[]
  ): Promise<void | Error> => {
    if (!files.length) {
      return;
    }
    for (const file of files) {
      try {
        fs.unlink(file, error => {
          if (error) throw error;
        });
      } catch (e) {
        Logger.error('error while deleting');
        throw e;
      }
    }
  };
  public static getInstance = (): contactUsController => {
    if (!contactUsController.instance) {
      contactUsController.instance = new contactUsController();
    }
    return contactUsController.instance;
  };
}
export default contactUsController;
