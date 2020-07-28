import Logger from '../helpers/logger';

const errorMiddleware = (
  error: Error,
  request: Request,
  response: Response
): void => {
  Logger.error(error.stack);
  // @ts-ignore
  response.status(500).send('Internal Server Error!!');
};

export default errorMiddleware;
