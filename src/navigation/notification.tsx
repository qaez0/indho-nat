import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import { MessageCenterRoutes } from './routes';
import { useRoute } from '@react-navigation/native';
import { TabsParamList } from '../types/nav';
import { useTheme } from '@ui-kitten/components';
import TopNavBase from '../components/layout/TopNavBase';

const Stack = createNativeStackNavigator();

const MessageCenterStack = () => {
  const route = useRoute();
  const theme = useTheme();
  const params = route.params as TabsParamList['message-center'];
  const initialRouteName = params?.screen || 'message-center-overview';

  const modifiedRoutes = MessageCenterRoutes.map(routeData => {
    if (routeData.name === 'message-center-specific') {
      return {
        ...routeData,
        options: {
          header: (props: NativeStackHeaderProps) => (
            <TopNavBase
              {...props}
              noPaddingTop={true}
              customTitle="Message Center"
            />
          ),
        },
        initialParams: params?.detail ? { detail: params.detail } : undefined,
      };
    } else if (routeData.name === 'message-center-overview') {
      return {
        ...routeData,
        options: {
          headerShown: false,
        },
      };
    }
    return routeData;
  });

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        contentStyle: {
          backgroundColor: theme['bg-secondary'],
        },
      }}
    >
      {modifiedRoutes.map((routedata, index) => (
        <Stack.Screen key={`${routedata.name + index}`} {...routedata} />
      ))}
    </Stack.Navigator>
  );
};

export default MessageCenterStack;
