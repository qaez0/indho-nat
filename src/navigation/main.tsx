import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/layout/DrawerContent';
import { DrawerParamList, TabsParamList } from '../types/nav';
import BottomTab from '../components/layout/BottomTab';
import { TabRoutes } from './routes';
import HeaderTabs from '../components/layout/HeaderTabs';
import { useTheme } from '@ui-kitten/components';
import { useLanguageStore } from '../store/useLanguageStore';
import AuthStack from './auth';

const Tab = createBottomTabNavigator<TabsParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const TabsNavigator = () => {
  const theme = useTheme();
  const { selected } = useLanguageStore();
  return (
    <Tab.Navigator
      key={selected.value}
      initialRouteName="home"
      screenOptions={{
        header: props => <HeaderTabs {...props} />,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: theme['bg-secondary'],
        },
      }}
      tabBar={BottomTab}
    >
      {TabRoutes.map((routedata, index) => (
        <Tab.Screen key={`${routedata.name + index}`} {...routedata} />
      ))}
    </Tab.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Drawer.Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}
    >
      <Drawer.Screen name="tabs" component={TabsNavigator} />
      <Drawer.Screen name="auth" component={AuthStack} />
    </Drawer.Navigator>
  );
};

export default MainTabs;
