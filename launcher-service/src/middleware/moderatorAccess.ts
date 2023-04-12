import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const moderatorAccess = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { moderator } = req.session;
  if (!moderator) {
    const err = new createHttpError.Unauthorized();
    next(err);
    return;
  }
  next();
};
