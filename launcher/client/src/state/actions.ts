import { AppStateType, TabsTypes } from 'src/components/types';

export const goToTab = (tab: TabsTypes) => {
  return {
    type: AppStateType.ACTIVE_TAB,
    payload: { activeTab: tab },
  };
};
