import { Group, JobCreator, Worker } from '@prisma/client';
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IRONSESSION_PASSWORD: string;
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
