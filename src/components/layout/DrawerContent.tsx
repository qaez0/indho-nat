import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Button, Text, useTheme } from '@ui-kitten/components';
import { JSX, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  authDrawerItems,
  useDrawerItems,
  IDrawerItems,
} from '../../constants/drawer';
import Feather from '@react-native-vector-icons/feather';
import { Fragment } from 'react';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  RootStackNav,
  RootStackParamList,
  TabsParamList,
} from '../../types/nav';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { TabRoutes } from '../../navigation/routes';
// import { useUser } from '../../store/useUser';
import Toast from 'react-native-toast-message';
import { useUserStore } from '../../store/useUser';
import { useUser } from '../../hooks/useUser';
import SpinningIcon from '../SpinningIcon';
import PulsingIcon from '../PulsingIcon';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthModal } from '../../store/useUIStore';
import { navigateToLogin } from '../../utils/navigation';

const DrawerContent = ({ navigation }: DrawerContentComponentProps) => {
  const { t } = useTranslation();
  const { isAuthenticated, balance, user, invalidate, isLoading } = useUser();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const globalNavig = useNavigation<RootStackNav>();
  const theme = useTheme();
  const closeDrawer = () => navigation.closeDrawer();
  const logout = useUserStore(state => state.logout);
  const openAuthModal = useAuthModal(state => state.openDialog);

  const handleLogout = () => {
    Toast.show({
      type: 'promise',
      text1: t('common-terms.logging-out'),
      text2: t('common-terms.please-wait'),
      onHide: () => {
        logout();
        closeDrawer();
        navigateToLogin();
      },
    });
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard',
      text2: text,
    });
  };

  const navigateTo = (
    path: keyof RootStackParamList | keyof TabsParamList,
    params?: any,
  ) => {
    if (path === 'lucky-spin' && !isAuthenticated) {
      openAuthModal();
      return;
    }
    if (TabRoutes.some(route => route.name === path)) {
      navigation.navigate('tabs', {
        screen: path as keyof TabsParamList,
        params,
      });
    } else {
      globalNavig.navigate(path as keyof RootStackParamList, params);
    }
    closeDrawer();
  };

  const onChildPress = (item: NonNullable<IDrawerItems['children']>[0]) => {
    if (item.onClick && !item.path) {
      item.onClick();

      closeDrawer();
    } else if (item.path) {
      navigateTo(item.path);
    }
    setExpandedSections([]);
  };

  const onMenuPress = (item: IDrawerItems) => {
    if (item.children) {
      if (expandedSections.includes(item.id)) {
        setExpandedSections(prev => prev.filter(id => id !== item.id));
      } else {
        setExpandedSections(prev => [...prev, item.id]);
      }
    } else {
      onChildPress(item);
    }
  };

  const drawerItems = useDrawerItems();
  const filteredDrawerItems = isAuthenticated
    ? drawerItems
    : drawerItems.filter(item => !authDrawerItems.includes(item.id));

  // Get current VIP level from user data
  const getCurrentVipLevel = () => {
    if (!user?.vip || Object.keys(user.vip).length === 0) {
      return '--';
    }

    const vipEntries = Object.entries(user.vip);
    const currentVipEntry = vipEntries.find(
      ([, details]) => details.status === 'CURRENT',
    );

    if (currentVipEntry) {
      const level = currentVipEntry[0].replace(/[^0-9]/g, '');
      return `VIP${level}`;
    }

    // If no current VIP level found, check if there's any VIP data and default to VIP0
    if (vipEntries.length > 0) {
      return 'VIP0';
    }

    return '--';
  };

  const renderMenuItem = (item: any, index: number) => (
    <Fragment key={index}>
      {/* Add line above "All Games" parent item specifically */}
      {item.id === 'all-games' && (
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.6)',
            'rgba(255,255,255,0.2)',
            'rgba(255,255,255,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 2,
            marginVertical: 8,
          }}
        />
      )}
      <TouchableOpacity
        style={{ ...styles.menuItem, ...styles.itemDimension }}
        onPress={() => onMenuPress(item)}
      >
        <View style={styles.menuItemDetails}>
          {item.iconStyle === 'side-bar-pulse-animation' ? (
            <PulsingIcon source={item.icon} style={styles.icon} />
          ) : (
            <Image source={item.icon} style={styles.icon} />
          )}
          <Text style={styles.menuItemText}>{item.label}</Text>
        </View>
        {item.children &&
          (expandedSections.includes(item.id) ? (
            <Feather name="chevron-down" size={24} color="white" />
          ) : (
            <Feather name="chevron-right" size={24} color="white" />
          ))}
      </TouchableOpacity>
      {item.children && expandedSections.includes(item.id) && (
        <View key={item.id} style={{ paddingLeft: 16 }}>
          {item.children.map((child: any, childIndex: number) => (
            <TouchableOpacity
              key={childIndex}
              style={{ ...styles.menuItemDetails, ...styles.itemDimension }}
              onPress={() => onChildPress(child)}
            >
              {child.iconStyle === 'side-bar-pulse-animation' ? (
                <PulsingIcon source={child.icon} style={styles.icon} />
              ) : (
                <Image source={child.icon} style={styles.icon} />
              )}
              <Text style={styles.menuItemText}>{child.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Add line below "All Games" parent item specifically */}
      {item.id === 'all-games' && (
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.6)',
            'rgba(255,255,255,0.2)',
            'rgba(255,255,255,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 2,
            marginVertical: 8,
          }}
        />
      )}
    </Fragment>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme['bg-primary'] }}
      edges={['bottom']}
    >
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <TouchableOpacity onPress={() => navigateTo('lucky-spin')}>
            <BannerDrawer />
          </TouchableOpacity>
          {isAuthenticated && (
            <Fragment>
              <DrawerCard
                data={{
                  icon: require('../../assets/drawer/big-user.png'),
                  label: t('common-terms.username'),
                  value: user?.player_info.player_id ?? '--',
                }}
                right={
                  <View style={styles.usernameRightContainer}>
                    <TouchableOpacity onPress={() => navigateTo('vip')}>
                      <View
                        style={[
                          styles.vipBadge,
                          { backgroundColor: '#F3B867' },
                        ]}
                      >
                        <Text style={styles.vipBadgeText}>
                          {getCurrentVipLevel()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        copyToClipboard(user?.player_info.player_id ?? '')
                      }
                    >
                      <Feather name="copy" size={16} color="gray" />
                    </TouchableOpacity>
                  </View>
                }
              />
              <DrawerCard
                data={{
                  icon: require('../../assets/drawer/wallet-coin.png'),
                  label: t('common-terms.balance'),
                  value: balance?.total?.toLocaleString() ?? '--',
                }}
                right={
                  <TouchableOpacity onPress={() => invalidate('balance')}>
                    <SpinningIcon isLoading={isLoading.balance}>
                      <Feather name="refresh-ccw" size={16} color="gray" />
                    </SpinningIcon>
                  </TouchableOpacity>
                }
              />
            </Fragment>
          )}

          <View style={styles.btnNavContainer}>
            <Button
              status="success"
              appearance="filled"
              style={styles.btnNavSize}
              onPress={() => {
                if (isAuthenticated) {
                  navigateTo('deposit-withdraw', { tab: 'deposit' });
                } else {
                  navigation.navigate('auth', {
                    screen: 'login',
                  });
                }
              }}
            >
              {isAuthenticated
                ? t('common-terms.deposit')
                : t('common-terms.login')}
            </Button>
            <Button
              appearance="filled"
              style={styles.btnNavSize}
              onPress={() => {
                if (isAuthenticated) {
                  navigateTo('deposit-withdraw', { tab: 'withdraw' });
                } else {
                  navigation.navigate('auth', {
                    screen: 'register',
                    params: { invite_code: undefined },
                  });
                }
              }}
            >
              {isAuthenticated
                ? t('common-terms.withdraw')
                : t('common-terms.register')}
            </Button>
          </View>
          <View>
            {filteredDrawerItems.map((item, index) =>
              renderMenuItem(item, index),
            )}
          </View>
          {isAuthenticated && (
            <Button
              appearance="outline"
              status="success"
              onPress={handleLogout}
            >
              <Text
                style={{
                  color: theme['color-success-600'],
                  fontWeight: '500',
                }}
              >
                {t('language.logout')}
              </Text>
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrawerContent;

const BannerDrawer = () => {
  return (
    <Image
      style={styles.bannerDrawer}
      source={{
        uri: 'https://11ic.fun/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/mobile-sidebar-spin-wheel/public',
      }}
    />
  );
};

interface IDrawerCardProps {
  data: {
    icon: number;
    label: string;
    value: string;
  };
  right: JSX.Element;
}
const DrawerCard = ({ data, right }: IDrawerCardProps) => {
  return (
    <View style={styles.drawerCard}>
      <View style={styles.menuItemDetails}>
        <Image source={data.icon} style={{ width: 40, height: 40 }} />
        <View style={{ display: 'flex', flexDirection: 'column', gap: 2    }}>
          <Text style={styles.menuItemText}>{data.label}</Text>
          <Text style={{ color: 'white', fontSize: 12 }}>{data.value}</Text>
        </View>
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  subContainer: {
    padding: 15,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  itemDimension: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  bannerDrawer: {
    height: 64,
    width: '100%',
    borderRadius: 14,
    objectFit: 'cover',
  },
  drawerCard: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#6a5232',
  },
  btnNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnNavSize: {
    flex: 1,
    height: 40,
    fontSize: 24,
  },
  usernameRightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  vipBadge: {
    paddingHorizontal: 0,
    paddingVertical: 2,
    borderRadius: 15,
    width: 60,
    height: 20,
  },
  vipBadgeText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
