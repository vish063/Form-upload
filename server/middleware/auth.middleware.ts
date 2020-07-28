import { NextFunction, Response, Request } from 'express';
/*import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';*/
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';

import Logger from '../helpers/logger';

const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  /*const cookies = request.cookies;
  const secret = process.env.JWT_SECRET;*/
  try {
    Logger.info('Auth Middleware');
    // verify auth
    // jwt.verify();
    next();
  } catch (error) {
    next(new WrongAuthenticationTokenException());
  }
};

export default authMiddleware;
