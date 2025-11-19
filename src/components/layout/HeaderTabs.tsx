import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, useTheme } from '@ui-kitten/components';
import { HeaderTabs as tabs } from '../../navigation/routes';
import { TabsParamList } from '../../types/nav';
import Home from '../../assets/top-nav/home.svg';
import Sports from '../../assets/top-nav/sports.svg';
import Casino from '../../assets/top-nav/casino.svg';
import Slots from '../../assets/top-nav/slots.svg';
import Promotions from '../../assets/top-nav/promotion.svg';
import VIP from '../../assets/top-nav/vip.svg';
import Affiliate from '../../assets/top-nav/affiliate.svg';
import { useAuthModal, useCurrentRoute } from '../../store/useUIStore';
import { useTranslation } from 'react-i18next';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useUser } from '../../hooks/useUser';

const HeaderTabs = ({ navigation }: BottomTabHeaderProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const currentRouteName = useCurrentRoute(state => state.currentRoute);
  const { isAuthenticated } = useUser();
  const openAuthModal = useAuthModal(state => state.openDialog);

  // Hide HeaderTabs when on lucky-spin or wheel page
  if (
    currentRouteName === 'lucky-spin' ||
    currentRouteName === 'wheel' ||
    currentRouteName === 'sponsor'
  ) {
    return null;
  }

  const navigateTo = (path: keyof TabsParamList) => {
    if (path === 'vip' && !isAuthenticated) {
      openAuthModal();

      return;
    }
    navigation.navigate(path);
  };

  const getIcon = (name: string, color: string) => {
    switch (name) {
      case 'home':
        return <Home color={color} />;
      case 'sports':
        return <Sports color={color} />;
      case 'casino':
        return <Casino color={color} />;
      case 'slots':
        return <Slots color={color} />;
      case 'promotions':
        return <Promotions color={color} />;
      case 'affiliate':
        return <Affiliate color={color} />;
      case 'vip':
        return <VIP color={color} />;
      default:
        return <Home color={color} />;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: theme['bg-primary'] }}
    >
      <View style={styles.container}>
        {tabs.map((item, index) => {
          return (
            <Button
              accessoryLeft={() =>
                getIcon(
                  item,
                  item === (currentRouteName as keyof TabsParamList)
                    ? theme['color-primary-500']
                    : '#fff',
                )
              }
              key={index}
              onPress={() => navigateTo(item)}
              status={currentRouteName === item ? 'success' : 'primary'}
              style={{
                paddingHorizontal: 5,
              }}
            >
              {t(`common-terms.${item}`)}
            </Button>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default HeaderTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
