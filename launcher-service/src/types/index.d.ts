import { Group, JobCreator, Worker } from '@prisma/client';
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IRONSESSION_PASSWORD: string;
      JWT_SECRET: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }
  }

  namespace Express {
    interface Request {
      group?: Group;
      jobCreator?: JobCreator;
      worker?: Worker;
    }
  }
}
