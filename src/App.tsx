import { GestureHandlerRootView } from 'react-native-gesture-handler';
import codePush from '@revopush/react-native-code-push';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { ApplicationProvider, ModalService } from '@ui-kitten/components';
import theme from './theme/theme.json';
import mapping from './theme/mapping.json';
import * as eva from '@eva-design/eva';
import RootNavigator from './navigation/root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import toastConfig from './components/toast';
import { initializeAdjust } from './services/adjust.service';
import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@env';
import { initializeAppsFlyer } from './services/appsflyer.service';
import SplashScreen from 'react-native-splash-screen';
export const queryClient = new QueryClient();
ModalService.setShouldUseTopInsets = true;

function App() {
  useEffect(() => {
    SplashScreen.hide();
    initializeAdjust({
      token: 'nwky61h83oqo',
      app_name: 'com.rayyojoy.app',
      agent_id: 'indhot',
      fb_app_id: '1160325669615932',
    }).catch(error => {
      console.error('Failed to initialize Adjust SDK:', error);
    });
    initializeAppsFlyer({
      devKey: 'kionJbhdBBDKE8BBK8kcA4',
      isDebug: false,
      onInstallConversionDataListener: true,
      onDeepLinkListener: true,
    });
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.light, ...theme }}
        customMapping={mapping}
      >
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootNavigator />
            <Toast config={toastConfig} position="top" visibilityTime={3000} />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ApplicationProvider>
    </QueryClientProvider>
  );
}

export default codePush(App);
