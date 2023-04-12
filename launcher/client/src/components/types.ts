export enum LauncherStageStatus {
  UNAUTHORIZED,
  GROUP_REQUEST,
  LAUNCH,
  LAUNCH_SUCCESS,
  LAUNCH_FAIL,
}

export type FundingMethodType = 'crypto' | 'fiat';

export type FortuneJobRequestType = {
  chainId: number;
  name: string;
  description: string;
  token: string;
  fundedAmt: string;
  guidelineUrl: string;
  jobRequester: string;
  fiat?: boolean;
  paymentId?: string;
  creatorId: number | null;
  funded: boolean;
};

export type CreatePaymentType = {
  amount: string;
  currency: string;
  paymentMethodType?: string;
  name?: string;
};

export type JobLaunchResponse = {
  escrowAddress: string;
  exchangeUrl: string;
};
