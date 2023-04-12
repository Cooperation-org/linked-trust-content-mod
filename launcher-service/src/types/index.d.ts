import { SiweMessage } from 'siwe';
import { GroupOwner, Moderator } from '@prisma/client';
export {};

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    nonce?: string;
    siwe?: SiweMessage;
    groupOwner?: GroupOwner;
    moderator?: Moderator;
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IRONSESSION_PASSWORD: string;
    }
  }
}
