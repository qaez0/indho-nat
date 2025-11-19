import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import {
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, Text } from 'react-native';
import { useTopNavTitle } from '../../store/useUIStore';
import { useMemo, useCallback } from 'react';

const TopNavBase = ({
  route,
  navigation,
  noPaddingTop = false,
  customTitle,
}: NativeStackHeaderProps & {
  noPaddingTop?: boolean;
  customTitle?: string;
}) => {
  const theme = useTheme();
  const title = useTopNavTitle(s => s.title);

  const getScreenTitle = useMemo(() => {
    return route.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }, [route.name]);

  const displayTitle = useMemo(() => {
    return title ?? customTitle ?? getScreenTitle;
  }, [title, customTitle, getScreenTitle]);

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const BackAction = useCallback((): React.ReactElement => (
    <TopNavigationAction
      icon={<Feather name="chevron-left" size={24} color="white" />}
      onPress={handleBackPress}
    />
  ), [handleBackPress]);

  const titleComponent = useCallback(() => (
    <Text style={{ color: 'white' }}>
      {displayTitle}
    </Text>
  ), [displayTitle]);

  return (
    <SafeAreaView edges={noPaddingTop ? [] : ['top']}>
      {!noPaddingTop && (
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme['top-nav-base']}
        />
      )}
      <TopNavigation
        title={titleComponent}
        alignment="center"
        accessoryLeft={BackAction}
        style={{ backgroundColor: theme['top-nav-base'] }}
      />
    </SafeAreaView>
  );
};

export default TopNavBase;
