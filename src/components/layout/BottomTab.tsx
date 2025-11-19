import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Text,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { JSX } from 'react';
import Home from '../../assets/bottom-nav/home.svg';
import Deposit from '../../assets/bottom-nav/deposit.svg';
import Earn from '../../assets/bottom-nav/earn.svg';
import Wheel from '../../assets/bottom-nav/wheel.svg';
import Slots from '../../assets/top-nav/slots.svg';
import { HIDDEN_TABS } from '../../navigation/routes';
import { TabsParamList } from '../../types/nav';
import { getBottomTabLabels } from '../../utils/translation';
import Glow from '../Glow';
import { useUserStore } from '../../store/useUser';
import { useAuthModal } from '../../store/useUIStore';

const BottomTab = ({ state, navigation }: BottomTabBarProps) => {
  const visibleTabs = state.routes.filter(
    route => !HIDDEN_TABS.includes(route.name),
  );
  const onSelect = (index: number) => {
    const route = visibleTabs[index];
    
    // Check if user is trying to navigate to deposit-withdraw
    if (route.name === 'deposit-withdraw') {
      const token = useUserStore.getState().token;
      const isAuthenticated = !!token?.auth_token;
      
      if (!isAuthenticated) {
        // Open login/register modal instead of navigating
        useAuthModal.getState().openDialog();
        return;
      }
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      const params: Record<string, object | undefined> = {
        'deposit-withdraw': { tab: 'deposit' },
        slots: {},
      };
      navigation.navigate(route.name, params[route.name]);
    }
  };

  const getIconName = (
    routeName: keyof TabsParamList,
    color: string,
  ): JSX.Element => {
    switch (routeName) {
      case 'home':
        return <Home color={color} />;
      case 'slots':
        return <Slots color={color} />;
      case 'deposit-withdraw':
        return (
            <Glow glowColor="#F3B867" glowIntensity={1.0}>
            <Deposit color={color} />
          </Glow>
        );
      case 'earn':
        return <Earn color={color} />;
      case 'wheel':
        return <Wheel color={color} />;
      default:
        return <></>;
    }
  };

  const getColors = (routeName: keyof TabsParamList, focused: boolean) => {
    if (focused && routeName !== 'earn') {
      return {
        iconColor: '#F3B867',
        textColor: '#F3B867',
      };
    }
    switch (routeName) {
      case 'deposit-withdraw':
        return {
          iconColor: '#F3B867',
          textColor: '#F3B867',
        };
      case 'earn':
        return {
          iconColor: 'rgba(255,32,32, 1)',
          textColor: 'rgba(255,32,32, 1)',
        };
      default:
        return {
          iconColor: '#8f8e8c',
          textColor: '#8f8e8c',
        };
    }
  };

  const getLabel = (routeName: keyof TabsParamList) => {
    const labels = getBottomTabLabels();

    switch (routeName) {
      case 'home':
        return labels.home;
      case 'slots':
        return labels.slots;
      case 'deposit-withdraw':
        return labels.deposit;
      case 'earn':
        return labels.earn;
      case 'wheel':
        return labels.wheel;
      default:
        return '';
    }
  };

  const renderTab = (route: any, _index: number) => {
    const isFocused =
      state.index === state.routes.findIndex(r => r.name === route.name);
    const colors = getColors(route.name, isFocused);

    return (
      <BottomNavigationTab
        key={route.key}
        title={(_evaProps: any) => (
          <Text
            style={[
              styles.label,
              { color: colors.textColor },
              isFocused && styles.focusedLabel,
            ]}
            numberOfLines={1}
          >
            {getLabel(route.name)}
          </Text>
        )}
        icon={(_evaProps: any) => getIconName(route.name, colors.iconColor)}
      />
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <Layout style={styles.container}>
        <BottomNavigation
          indicatorStyle={{
            height: 3,
            backgroundColor: '#F3B867',
          }}
          selectedIndex={state.index}
          onSelect={onSelect}
          style={styles.bottomNavigation}
        >
          {visibleTabs.map((route, index) => renderTab(route, index))}
        </BottomNavigation>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1C1E22',
  },
  container: {
    backgroundColor: '#1C1E22',
    borderTopColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomNavigation: {
    backgroundColor: '#1C1E22',
    paddingTop: 8,
  },
  icon: {
    marginBottom: 4,
  },
  depositIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#F3B867',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  earnIcon: {
    shadowColor: 'rgba(255,32,32, 1)',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  focusedLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default BottomTab;
