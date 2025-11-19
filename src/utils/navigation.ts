import {
  createNavigationContainerRef,
  DrawerNavigationState,
  NavigationState,
  ParamListBase,
} from '@react-navigation/native';
import { RootStackParamList, TabsParamList } from '../types/nav';
import { Linking } from 'react-native';
import { getDrawerStatusFromState } from '@react-navigation/drawer';
import { useCurrentRoute, useDrawerState } from '../store/useUIStore';

export const getTabLocation = (navigation: any) => {
  try {
    const state = navigation.getState();
    if (!state || !state.routes) {
      return 'home' as keyof TabsParamList;
    }
    const directTabsRoute = state.routes.find((r: any) => r.name === 'tabs');
    if (directTabsRoute && directTabsRoute.state) {
      const tabsState = directTabsRoute.state;
      if (tabsState.routes && tabsState.index !== undefined) {
        const currentRoute = tabsState.routes[tabsState.index];
        if (currentRoute && currentRoute.name) {
          return currentRoute.name as keyof TabsParamList;
        }
      }
    }
    const mainTabsRoute = state.routes.find((r: any) => r.name === 'main-tabs');
    if (mainTabsRoute && mainTabsRoute.state) {
      const drawerState = mainTabsRoute.state;
      if (drawerState.routes && drawerState.index !== undefined) {
        const activeDrawerRoute = drawerState.routes[drawerState.index];

        if (activeDrawerRoute?.name === 'auth' && activeDrawerRoute.state) {
          const authState = activeDrawerRoute.state;
          if (authState.routes && authState.index !== undefined) {
            const currentAuthRoute = authState.routes[authState.index];
            if (currentAuthRoute && currentAuthRoute.name) {
              return currentAuthRoute.name as any;
            }
          }
        }
        if (activeDrawerRoute?.name === 'tabs' && activeDrawerRoute.state) {
          const tabsState = activeDrawerRoute.state;
          if (tabsState.routes && tabsState.index !== undefined) {
            const currentRoute = tabsState.routes[tabsState.index];
            if (currentRoute && currentRoute.name) {
              return currentRoute.name as keyof TabsParamList;
            }
          }
        }
      }
    }
    return 'home' as keyof TabsParamList;
  } catch (error) {
    console.warn('Error getting tab location:', error);
    return 'home' as keyof TabsParamList;
  }
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToLogin() {
  navigationRef.navigate('main-tabs', {
    screen: 'auth',
    params: { screen: 'login' },
  });
}

export const navigateToRegistration = () => {
  const handleDeepLink = (event: { url: string }) => {
    let url = event.url.split('://')[1];
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    if (url) {
      navigationRef.navigate('main-tabs', {
        screen: 'auth',
        params: {
          screen: 'register',
          params: {
            invite_code: url,
          },
        },
      });
    }
  };

  Linking.getInitialURL().then(url => {
    if (url) handleDeepLink({ url });
  });

  const subscription = Linking.addEventListener('url', handleDeepLink);
  return () => subscription.remove();
};

export const rootOnStateChange = (state: NavigationState | undefined) => {
  const setDrawerState = useDrawerState.getState().setDrawerState;
  const setCurrentRoute = useCurrentRoute.getState().setCurrentRoute;

  if (!state?.routes?.length) return;

  const currentRoute = state.routes[state.index ?? 0] as any;
  if (currentRoute?.name === 'main-tabs') {
    const drawerState = currentRoute.state as
      | DrawerNavigationState<ParamListBase>
      | undefined;
    if (drawerState && drawerState.routes?.length) {
      const drawerStatus = getDrawerStatusFromState(drawerState);
      setDrawerState(drawerStatus === 'open');

      const drawerFocused = drawerState.routes[drawerState.index ?? 0] as any;
      if (drawerFocused?.name === 'tabs') {
        const tabsState = drawerFocused.state as any;
        if (tabsState?.routes?.length) {
          const tabFocused = tabsState.routes[tabsState.index ?? 0];
          if (tabFocused?.name) {
            setCurrentRoute(tabFocused.name as keyof TabsParamList);
            return;
          }
        }
        return;
      } else if (drawerFocused?.name) {
        setCurrentRoute(drawerFocused.name as keyof RootStackParamList);
        return;
      }
    }
    const currentRouteStore = useCurrentRoute.getState().currentRoute;
    if (!currentRouteStore || currentRouteStore === 'home') {
      setDrawerState(false);
      setCurrentRoute('home' as keyof TabsParamList);
    }
    return;
  }
  setDrawerState(false);
  if (currentRoute?.name) {
    setCurrentRoute(currentRoute.name as keyof RootStackParamList);
  }
};
