import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/nav';
import { NavigationContainer } from '@react-navigation/native';
import {
  navigateToRegistration,
  navigationRef,
  rootOnStateChange,
} from '../utils/navigation';
import { useTheme } from '@ui-kitten/components';
import { RootRoutes } from './routes';
import TopNavBase from '../components/layout/TopNavBase';
import { HelperModal } from '../components/modal';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['game11ic://'],
  config: {
    screens: {
      'transaction-record': 'transaction-record',
      'main-tabs': {
        screens: {
          auth: {
            screens: {
              register: {
                path: ':invite_code',
                parse: {
                  invite_code: (invite_code: string) => invite_code,
                },
              },
            },
          },
        },
      },
    },
  },
};

const RootNavigator = () => {
  const theme = useTheme();

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={navigateToRegistration}
      onStateChange={rootOnStateChange}
    >
      <Stack.Navigator
        initialRouteName="main-tabs"
        screenOptions={{
          header: TopNavBase,
          animation: 'ios_from_right',
          contentStyle: {
            backgroundColor: theme['bg-secondary'],
          },
        }}
      >
        {RootRoutes.map((routedata, index) => (
          <Stack.Screen key={`${routedata.name + index}`} {...routedata} />
        ))}
      </Stack.Navigator>
      <HelperModal />
    </NavigationContainer>
  );
};

export default RootNavigator;
