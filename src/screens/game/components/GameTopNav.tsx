import {
  TopNavigation,
  TopNavigationAction,
  useTheme,
  Text,
} from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StatusBar,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Logo from '../../../assets/logo.svg';
import {
  useGameDisplay,
  useCurrentRoute,
  useLandscapeMode,
} from '../../../store/useUIStore';
import { useQuitGameDialog } from '../../../store/useQuitGameDialog';
import Toast from 'react-native-toast-message';
import { useUser } from '../../../hooks/useUser';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const GameTopNav = ({ navigation, route }: NativeStackHeaderProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const rawData = useGameDisplay(s => s.data);
  const openDialog = useQuitGameDialog(s => s.openDialog);
  const resetGameDisplay = useGameDisplay(s => s.resetGameDisplay);
  const setDepositGateway = useGameDisplay(s => s.setDepositGateway);
  const { invalidate } = useUser();
  const currentScreen = route.name;
  const currentRoute = useCurrentRoute(s => s.currentRoute);
  const { isLandscape, setIsLandscape } = useLandscapeMode();
  const [showLogo, setShowLogo] = useState(true);

  const handleBackPress = useCallback(() => {
    if (currentScreen === 'game') {
      openDialog({
        message: t('common-terms.quit-game-confirm'),
        confirmButtonText: t('common-terms.quit'),
        cancelButtonText: t('common-terms.cancel'),
        onConfirm: async () => {
          try {
            Toast.show({ 
              type: 'promise', 
              text1: t('common-terms.logging-out-game')
            });
            invalidate('balance');
            invalidate('panel-info');
            resetGameDisplay();
            setIsLandscape(false);
          } catch (error) {
            console.error(error);
          } finally {
            Toast.hide();
            navigation.goBack();
          }
        },
      });
      return true;
    }

    if (currentScreen === 'in-game-deposit') {
      navigation.goBack();
      return true;
    }

    if (currentScreen === 'payment-gateway') {
      openDialog({
        message: t('common-terms.transaction-done-confirm'),
        confirmButtonText: t('common-terms.confirm'),
        cancelButtonText: t('common-terms.cancel'),
        onConfirm: async () => {
          setDepositGateway(undefined);
          navigation.goBack();
        },
      });
      return true;
    }
    return false;
  }, [currentScreen, openDialog, t, invalidate, resetGameDisplay, setIsLandscape, navigation, setDepositGateway]);

  useEffect(() => {
    if (currentRoute !== 'game') {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, [currentScreen, rawData?.url, currentRoute, handleBackPress]);

  // Show/hide logo based on current screen
  useEffect(() => {
    if (currentScreen === 'game') {
      setShowLogo(true); // Show logo on game screen
    } else if (
      currentScreen === 'in-game-deposit' ||
      currentScreen === 'payment-gateway'
    ) {
      setShowLogo(false); // Hide logo on deposit screens
    }
  }, [currentScreen]);

  const BackAction = () => {
    return (
      <TouchableOpacity
        onPress={handleBackPress}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <View style={styles.leftContainer}>
          <TopNavigationAction
            icon={<Feather name="chevron-left" size={24} color="white" />}
            onPress={handleBackPress}
          />
          {showLogo && (
            <View style={styles.logoContainer}>
              <Logo width={70} height={20} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const DepositAction = () => {
    if (currentScreen === 'deposit' || currentScreen === 'payment-gateway')
      return <View />;
    const handleDepositPress = () => {
      navigation.navigate('in-game-deposit');
    };
    return (
      <TouchableOpacity
        style={styles.depositButton}
        onPress={handleDepositPress}
      >
        <Text style={styles.depositButtonText}>
          {t('common-terms.add-cash')}
          </Text>
        <View
          style={{
            borderRadius: 100,
            backgroundColor: '#F3B867',
            padding: 4,
          }}
        >
          <Image
            source={require('../../../assets/common/game-header/wallet.png')}
            style={styles.walletIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme['top-nav-base']}
      />
      {isLandscape && currentScreen === 'game' ? null : (
        <TopNavigation
          title=""
          alignment="center"
          accessoryLeft={BackAction}
          accessoryRight={currentScreen === 'game' ? DepositAction : undefined}
          style={{ backgroundColor: theme['top-nav-base'] }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  depositButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  depositButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  walletIcon: {
    width: 15,
    height: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20,
  },
});

export default GameTopNav;
