import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const groupOwnerAccess = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { groupOwner } = req.session;
  if (!groupOwner) {
    const err = new createHttpError.Unauthorized();
    next(err);
    return;
  }
  next();
};
