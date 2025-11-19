import { Button, Text } from '@ui-kitten/components';
import { ActivityIndicator, Image, ImageBackground } from 'react-native';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

type WheelWrapperProps = PropsWithChildren & {
  onRewardsClick: () => void;
  onFreeSpinClick: () => void;
  freeSpinCount: number;
  isFreeSpinLoading: boolean;
  isAuthenticated?: boolean;
};

const WheelWrapper = ({
  children,
  onRewardsClick,
  onFreeSpinClick,
  freeSpinCount,
  isFreeSpinLoading,
  isAuthenticated = true,
}: WheelWrapperProps) => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <ImageBackground
        source={require('../../../assets/wheel/bg.png')}
        style={{
          width: '100%',
          position: 'relative',
          marginTop: 40,
        }}
        resizeMode="contain"
      >
        <Image
          source={require('../../../assets/wheel/coin.png')}
          style={{
            height: 300,
            width: 130,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            transform: [{ rotate: '180deg' }],
          }}
        />
        <View style={{ zIndex: 1, paddingBottom: 50 }}>{children}</View>
        <Image
          source={require('../../../assets/wheel/coin.png')}
          style={{
            height: 300,
            width: 130,
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 0,
          }}
        />
      </ImageBackground>

      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 50,
        }}
      >
        <Button
          style={{ minWidth: 120, minHeight: 40 }}
          appearance="filled"
          status="primary"
          onPress={onFreeSpinClick}
          disabled={!isAuthenticated || freeSpinCount === 0 || isFreeSpinLoading}
        >
          {isFreeSpinLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text>{`(${freeSpinCount}) ${t('wheel.free-spin-button')}`}</Text>
          )}
        </Button>
        <Button
          style={{ minWidth: 120, minHeight: 40 }}
          appearance="filled"
          status="success"
          onPress={onRewardsClick}
        >
          {t('wheel.rewards-button')}
        </Button>
      </View>
    </View>
  );
};

export default WheelWrapper;
