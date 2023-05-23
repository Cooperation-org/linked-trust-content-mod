import {
  AppStateType,
  TabsTypes,
  LauncherStageStatus,
} from 'src/components/types';

export const goToTab = (tab: TabsTypes) => {
  return {
    type: AppStateType.ACTIVE_TAB,
    payload: { activeTab: tab },
  };
};
export const changeLauncerStatus = (status: LauncherStageStatus) => {
  return {
    type: AppStateType.ACTIVE_LAUNCHER_STATUS,
    payload: { launcherStatus: status },
  };
};
