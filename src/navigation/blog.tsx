import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlogsRoutes } from './routes';
import { useTheme } from '@ui-kitten/components';

const Stack = createNativeStackNavigator();

const BlogStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="blogs"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme['bg-secondary'],
        },
      }}
    >
      {BlogsRoutes.map((routedata, index) => (
        <Stack.Screen key={`${routedata.name + index}`} {...routedata} />
      ))}
    </Stack.Navigator>
  );
};

export default BlogStack;
