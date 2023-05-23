import { createContext, useReducer } from 'react';
import { AppStateType, TabsTypes, LauncherStageStatus} from 'src/components/types';


interface AppState {
  activeTab: number;
  launcherStatus: LauncherStageStatus;
}

const initialState: AppState = {
  activeTab: 1,
  launcherStatus: LauncherStageStatus.UNAUTHORIZED,
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppActions>;
}>({ state: initialState, dispatch: () => null });

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

type AppStatePayload = {
  [AppStateType.ACTIVE_TAB]: {
    activeTab: TabsTypes;
  };
  [AppStateType.ACTIVE_LAUNCHER_STATUS]: {
    launcherStatus: LauncherStageStatus;
  };
};

type AppActions = ActionMap<AppStatePayload>[keyof ActionMap<AppStatePayload>];
// type AppActions = ActionMap<AppStatePayload>[keyof ActionMap<AppStatePayload>] | { type: AppStateType.ACTIVE_LAUNCHER_STATUS; payload: { launcherStatus: LauncherStageStatus; } };


const appReducer = (state: AppState, action: AppActions) => {
  switch (action.type) {
    case AppStateType.ACTIVE_TAB:
      return { ...state, activeTab: action.payload.activeTab };
    case AppStateType.ACTIVE_LAUNCHER_STATUS:
      return { ...state, launcherStatus: action.payload.launcherStatus };
    default:
      return state;
  }
};

export const AppStateProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
