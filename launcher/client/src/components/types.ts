export enum LauncherStageStatus {
  UNAUTHORIZED,
  GROUP_REQUEST,
  LAUNCH,
  LAUNCH_SUCCESS,
  LAUNCH_FAIL,
}

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum AppStateType {
  ACTIVE_TAB = 'ACTIVE_TAB',
  ACTIVE_LAUNCHER_STATUS = 'ACTIVE_LAUNCHER_STATUS',
}

type AppStatePayload = {
  [AppStateType.ACTIVE_TAB]: {
    activeTab: TabsTypes;
  };
  [AppStateType.ACTIVE_LAUNCHER_STATUS]: {
    launcherStatus: LauncherStageStatus;
  };
};

export type AppActions =
  ActionMap<AppStatePayload>[keyof ActionMap<AppStatePayload>];

export enum TabsTypes {
  DASHBOARD,
  REQUEST_A_GROUP,
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
