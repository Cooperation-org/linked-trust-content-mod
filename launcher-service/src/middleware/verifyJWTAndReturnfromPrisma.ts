import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { prisma } from '../db';

export const verifyJWTAndReturnfromPrisma = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  interface TokenPayload {
    id: number;
    role: string;
    iat: number;
    exp: number;
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;
      if (decoded.role === 'jobCreator') {
        const jobCreator = await prisma.jobCreator.findFirst({
          where: { id: decoded.id },
        });
        if (jobCreator === null) {
          throw new createError.Unauthorized('not found in database');
        }
        req.jobCreator = jobCreator;
      } else if (decoded.role === 'worker') {
        const worker = await prisma.worker.findFirst({
          where: { id: decoded.id },
        });
        if (worker === null) {
          throw new createError.Unauthorized('not found in database');
        }
        req.worker = worker;
      }
      next();
    } catch (err: any) {
      const message =
        err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      next(new createError.Unauthorized(message));
    }
  } else {
    next(new createError.Unauthorized('Access token required'));
  }
};
