import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db';
import createHttpError from 'http-errors';
import { handleErrorWithExpress } from '../utils';

export const apiKeyAccess = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
      const err = new createHttpError.Unauthorized();
      throw err;
    }

    const hashedApiKey = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');

    const group = await prisma.group.findFirst({
      where: {
        apiKey: hashedApiKey,
      },
    });

    if (!group) {
      const err = new createHttpError.Unauthorized();
      throw err;
    }

    req.group = group;

    next();
  } catch (err) {
    handleErrorWithExpress(err, next);
  }
};
