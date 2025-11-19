import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RandomCards from './component/RandomCards';
import Spin from './component/Spin';
import { useLuckySpin } from './useLuckySpin';
import { useQuery } from '@tanstack/react-query';
import FadeScaleView from './animations/FadeScaleView';
import { Text, Modal, useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import Header from '../../components/layout/Header';
import { useCustomDrawer } from '../../store/useUIStore';
import DrawerContent from '../../components/layout/DrawerContent';
import { useNavigation } from '@react-navigation/native';
import { RootStackNav } from '../../types/nav';

const LuckySpinScreen = () => {
  const { t } = useTranslation();
  const { fetchEventDetails, setDetails } = useLuckySpin();
  const customDrawer = useCustomDrawer();
  const theme = useTheme();
  const navigation = useNavigation<RootStackNav>();
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  
  // Calculate header height: safe area top + header container height (50px)
  const headerHeight = insets.top + 50;

  const query = useQuery({
    queryKey: ['lucky-spin-event-details-initial-check'],
    queryFn: fetchEventDetails,
  });

  React.useEffect(() => {
    if (query.data?.data) {
      setDetails(query.data.data);
    }
  }, [query.data, setDetails]);

  // Animate drawer slide
  React.useEffect(() => {
    if (customDrawer.isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [customDrawer.isOpen, slideAnim]);

  // Create a mock drawer navigation object for DrawerContent
  const mockDrawerProps = React.useMemo(() => {
    return {
      navigation: {
        closeDrawer: () => customDrawer.closeDrawer(),
        toggleDrawer: () => customDrawer.toggleDrawer(),
        openDrawer: () => customDrawer.openDrawer(),
        navigate: (name: string, params?: any) => {
          customDrawer.closeDrawer();
          
          // If navigating to 'tabs', we need to navigate through 'main-tabs' first
          // because we're on a root route (lucky-spin), not inside the drawer navigator
          if (name === 'tabs') {
            navigation.navigate('main-tabs', {
              screen: 'tabs',
              params: params || {},
            });
          } else {
            // For other routes (root routes), navigate directly
            navigation.navigate(name as any, params);
          }
        },
      },
      state: {
        routes: [],
        index: 0,
      },
      descriptors: {},
    } as any;
  }, [customDrawer, navigation]);

  return (
    <>
      <Header />
      <ImageBackground
        source={require('../../assets/lucky-spin/background.png')}
        resizeMode="cover"
        style={styles.container}
      >
      {query.data?.data ? (
        <FadeScaleView>
          <Spin totalAmount={query.data.data.eventInfo.total_received_reward} />
        </FadeScaleView>
      ) : !query.isLoading && !query.data?.data ? (
        <RandomCards onClickWithdraw={() => query.refetch()} />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
          }}
        >
          <ActivityIndicator size="small" color="white" />
          <Text category="p1" style={{ color: 'white' }}>
            {t('lucky-spin.please-wait')}
          </Text>
        </View>
      )}
      </ImageBackground>

      {/* Custom Drawer Modal for lucky-spin page only */}
      {customDrawer.isOpen && (
        <Modal
          visible={customDrawer.isOpen}
          backdropStyle={styles.drawerBackdrop}
          onBackdropPress={customDrawer.closeDrawer}
          animationType="none"
          shouldUseContainer={false}
        >
          <View style={[styles.drawerWrapper, { marginTop: headerHeight }]}>
            <Animated.View
              style={[
                styles.drawerContainer,
                {
                  backgroundColor: theme['bg-primary'] || '#1A1A1A',
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <DrawerContent {...mockDrawerProps} />
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default LuckySpinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 320,
    flex: 1,
  },
});
