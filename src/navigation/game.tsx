import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameRoutes } from './routes';
import { useTheme } from '@ui-kitten/components';
import GameTopNav from '../screens/game/components/GameTopNav';

const Stack = createNativeStackNavigator();

const GameStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="game"
      screenOptions={{
        header: GameTopNav,
        contentStyle: {
          backgroundColor: theme['bg-secondary'],
        },
      }}
    >
      {GameRoutes.map((routedata, index) => (
        <Stack.Screen key={`${routedata.name + index}`} {...routedata} />
      ))}
    </Stack.Navigator>
  );
};

export default GameStack;
