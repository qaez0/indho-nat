import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Logo from '../../assets/logo.svg';
import { Fragment } from 'react/jsx-runtime';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { DrawerActions, useNavigation, useNavigationState } from '@react-navigation/native';
import { useUserStore } from '../../store/useUser';
import Toast from 'react-native-toast-message';
import HamburgerMenu from '../HamburgerMenu';
import { Button, Text, useTheme } from '@ui-kitten/components';
import { RootStackNav } from '../../types/nav';
import Feather from '@react-native-vector-icons/feather';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import CountryFlag from '../../assets/common/flag.svg';
import { getTabLocation } from '../../utils/navigation';
import { useUser } from '../../hooks/useUser';
import SpinningIcon from '../SpinningIcon';
import NotificationModal from '../../screens/message-center/component/NotificationModal';
import { useNotificationModal } from '../../hooks/useUIHelpers';
import LanguageDropdown from '../LanguageDropdown';
import { useDrawerState, useCurrentRoute, useCustomDrawer } from '../../store/useUIStore';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { isAuthenticated, balance, isLoading, invalidate, user } = useUser();
  const navigation = useNavigation<RootStackNav>();
  const theme = useTheme();
  
  // Get current route name reactively using navigation state
  const navigationRouteName = useNavigationState(state => {
    if (!state) return 'home';
    return getTabLocation({ getState: () => state } as any);
  });
  
  // Local state to track intended route for immediate UI update
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);
  
  // Use navigation route name, but override with intended route if set
  const currentRouteName = intendedRoute || navigationRouteName;
  
  // Reset intended route when navigation state catches up
  const currentRoute = useCurrentRoute(state => state.currentRoute);
  const openNotificationModal = useNotificationModal(s => s.openModal);
  const logout = useUserStore(state => state.logout);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  
  // Reset intended route when navigation state matches
  useEffect(() => {
    if (intendedRoute && intendedRoute === navigationRouteName) {
      setIntendedRoute(null);
    }
  }, [intendedRoute, navigationRouteName]);
  const drawerState = useDrawerState(state => state.drawerState);
  const customDrawer = useCustomDrawer();
  const { t } = useTranslation();
  const handleLanguageDropdownToggle = useCallback(() => {
    setLanguageDropdownVisible(prev => !prev);
  }, []);

  // Handle drawer toggle - use custom drawer for lucky-spin, normal drawer for others
  const handleDrawerToggle = useCallback(() => {
    // Special handling for lucky-spin page - use custom drawer modal
    if (currentRoute === 'lucky-spin') {
      customDrawer.toggleDrawer();
      return;
    }

    // For all other pages, use normal drawer navigation
    try {
      // Try to find drawer navigator in parent hierarchy
      let drawerNavigator = navigation.getParent();
      while (drawerNavigator && drawerNavigator.getState) {
        const state = drawerNavigator.getState();
        // Check if this is a drawer navigator
        if (state && 'type' in state && (state as any).type === 'drawer') {
          drawerNavigator.dispatch(DrawerActions.toggleDrawer());
          return;
        }
        drawerNavigator = drawerNavigator.getParent();
      }
      // Fallback: try direct dispatch
      navigation.dispatch(DrawerActions.toggleDrawer());
    } catch (error) {
      // Final fallback: try direct dispatch
      try {
        navigation.dispatch(DrawerActions.toggleDrawer());
      } catch (e) {
        // Silently fail if drawer cannot be toggled
      }
    }
  }, [navigation, currentRoute, customDrawer]);

  // Handle logout from dropdown
  const handleLogout = () => {
    Toast.show({
      type: 'promise',
      text1: t('common-terms.logging-out'),
      text2: t('common-terms.please-wait'),
      autoHide: true,
    });

    setTimeout(() => {
      logout();
      setLanguageDropdownVisible(false);
      navigation.navigate('auth', {
        screen: 'login',
      });
      Toast.hide();
    }, 3000);
  };

  // Check if we're on any auth page
  const isOnAuthPage = currentRouteName === 'login' || currentRouteName === 'register';

  const headerDetails = useMemo(
    () => [
      {
        visibility: !isAuthenticated && currentRouteName !== 'login',
        content: (
            <Button
              appearance="filled"
            status="primary"
            style={[styles.authButton, isOnAuthPage ? styles.authButtonActive : null]}
            onPress={() => {
              // Hide button immediately
              setIntendedRoute('login');
                navigation.navigate('auth', {
                  screen: 'login',
              });
            }}
          >
            {(evaProps: any) => (
              <Text
                {...evaProps}
                style={[evaProps?.style, isOnAuthPage ? styles.authButtonTextActive : null]}
            >
              {t('common-terms.login')}
              </Text>
            )}
            </Button>
        ),
      },
      {
        visibility: !isAuthenticated && currentRouteName !== 'register',
        content: (
            <Button
              appearance="filled"
            status="primary"
            style={[styles.authButton, isOnAuthPage ? styles.authButtonActive : null]}
            onPress={() => {
              // Hide button immediately
              setIntendedRoute('register');
                navigation.navigate('auth', {
                  screen: 'register',
                  params: { invite_code: undefined },
              });
            }}
          >
            {(evaProps: any) => (
              <Text
                {...evaProps}
                style={[evaProps?.style, isOnAuthPage ? styles.authButtonTextActive : null]}
            >
              {t('common-terms.register')}
              </Text>
            )}
            </Button>
        ),
      },
      {
        visibility: isAuthenticated,
        content: (
          <View style={styles.containerBalance}>
            <TouchableOpacity
              onPress={() => {
                invalidate('panel-info');
                invalidate('balance');
              }}
            >
              <SpinningIcon isLoading={isLoading.panelInfo || isLoading.balance}>
                <Feather name="refresh-ccw" size={16} color={'gray'} />
              </SpinningIcon>
            </TouchableOpacity>
            <Image
              source={require('../../assets/drawer/wallet-coin.png')}
              style={{ width: 16, height: 16 }}
            />
            <Text>
              {isLoading.balance
                ? '--'
                : balance?.total?.toLocaleString() || '0'}
            </Text>
          </View>
        ),
      },
      {
        visibility: isAuthenticated,
        content: (
          <TouchableOpacity
            style={{ position: 'relative' }}
            onPress={openNotificationModal}
          >
            <FontAwesome6
              name="bell"
              iconStyle="solid"
              size={18}
              color={'white'}
            />
            {user?.unread_message_count !== undefined &&
              user?.unread_message_count !== null &&
              user?.unread_message_count > 0 && (
                <View style={styles.unreadMessageCount}>
                  <Text
                    category="label"
                    style={{
                      color: 'white',
                      fontSize: user?.unread_message_count > 99 ? 8 : 10,
                    }}
                  >
                    {user?.unread_message_count > 99
                      ? '99+'
                      : user?.unread_message_count}
                  </Text>
                </View>
              )}
          </TouchableOpacity>
        ),
      },
      {
        visibility: true, // Always show language selector for all users
        content: (
          <TouchableOpacity
            style={styles.containerCountry}
            onPress={handleLanguageDropdownToggle}
            accessibilityLabel="Language selector"
            accessibilityHint="Tap to change language"
          >
            <CountryFlag width={24} height={24} />
            <Feather name="chevron-down" size={16} color={'white'} />
          </TouchableOpacity>
        ),
      },
    ],
    [
      isAuthenticated,
      navigation,
      currentRouteName,
      isOnAuthPage,
      balance,
      invalidate,
      isLoading.balance,
      user?.unread_message_count,
      isLoading.panelInfo,
      isLoading.balance,
      openNotificationModal,
      handleLanguageDropdownToggle,
      t,
    ],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.headerWrapper}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme['bg-secondary']}
      />
      <TouchableWithoutFeedback
        onPress={() => setLanguageDropdownVisible(false)}
      >
        <View
          style={{ ...styles.container, backgroundColor: theme['bg-primary'] }}
        >
          <View style={styles.row}>
            <HamburgerMenu
              onClick={handleDrawerToggle}
              isDrawerOpen={drawerState}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('main-tabs', {
                  screen: 'tabs',
                  params: {
                    screen: 'home',
                  },
                })
              }
              activeOpacity={0.7}
            >
              <Logo />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            {headerDetails.map(
              (detail, index) =>
                detail.visibility && (
                  <Fragment key={index}>{detail.content}</Fragment>
                ),
            )}
          </View>
          <NotificationModal
            onSeeAllNotifications={() =>
              navigation.navigate('main-tabs', {
                screen: 'tabs',
                params: {
                  screen: 'message-center',
                  params: {
                    screen: 'message-center-overview',
                  },
                },
              })
            }
            onViewSpecificNotification={detail => {
              navigation.navigate('main-tabs', {
                screen: 'tabs',
                params: {
                  screen: 'message-center',
                  params: {
                    screen: 'message-center-specific',
                    detail,
                  },
                },
              });
            }}
          />
          <LanguageDropdown
            visible={languageDropdownVisible}
            onClose={() => setLanguageDropdownVisible(false)}
            onLogout={handleLogout}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    zIndex: 1000,
    elevation: 1000,
  },
  container: {
    height: 50,
    paddingHorizontal: 15,
    paddingVertical: 13,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  containerBalance: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  containerCountry: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
    borderRadius: 40,
    backgroundColor: '#181818',
  },
  unreadMessageCount: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButton: {
    // Base styles
  },
  authButtonActive: {
    backgroundColor: '#F3B867',
  },
  authButtonTextActive: {
    color: '#000',
  },
});

export default Header;
