import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthRoutes } from './routes';
import { useTheme } from '@ui-kitten/components';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme['bg-secondary'],
        },
      }}
    >
      {AuthRoutes.map((routedata, index) => (
        <Stack.Screen key={`${routedata.name + index}`} {...routedata} />
      ))}
    </Stack.Navigator>
  );
};

export default AuthStack;
