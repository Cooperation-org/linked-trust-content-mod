import {
  AppStateType,
  TabsTypes,
  LauncherStageStatus,
  AppActions,
} from 'src/components/types';

export const goToTab = (tab: TabsTypes): AppActions => {
  return {
    type: AppStateType.ACTIVE_TAB,
    payload: { activeTab: tab },
  };
};

export const changeLauncherStatus = (
  status: LauncherStageStatus
): AppActions => {
  return {
    type: AppStateType.ACTIVE_LAUNCHER_STATUS,
    payload: { launcherStatus: status },
  };
};
