import { NextFunction } from 'express';
import createHttpError from 'http-errors';

export const handleErrorWithExpress = (err: unknown, next: NextFunction) => {
  if (typeof err === 'object' && err && !('statusCode' in err)) {
    const fiveHundredError = new createHttpError.InternalServerError(
      'Could not process the request. Try again later!'
    );
    return next(fiveHundredError);
  }
  next(err);
};
