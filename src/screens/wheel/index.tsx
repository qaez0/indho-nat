import HeaderMessage from './component/HeaderMessage';
import { useState, useCallback } from 'react';
import RouletteWheel from './component/RouletteWheel';
import WheelWrapper from './component/WheelWrapper';
import DailyDeposit from './component/DailyDeposit';
import Rules from './component/Rules';
import { CheckInDialog } from './component/CheckInDialog';
import NoticeDialog from './component/NoticeDialog';
import { useNoticeDialog } from './hooks/useNoticeDialog';
import { useWheel } from './hooks/useWheel';
import { useUser } from '../../hooks/useUser';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, View } from 'react-native';
import { RouletteData } from '../../types/wheel';
import { RootStackNav } from '../../types/nav';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function WheelScreen() {
  const { t } = useTranslation();
  const [targetId, setTargetId] = useState<number | undefined>(undefined);
  const [isLoadingTarget, setIsLoadingTarget] = useState(false);
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [isWheelFocused, setIsWheelFocused] = useState(false);
  const { open } = useNoticeDialog();
  const globalNavig = useNavigation<RootStackNav>();

  const {
    queryPrizes,
    querySpinCount,
    querySpinResult,
    queryCheckInAndRewards,
    claimFreeSpinMutation,
  } = useWheel(isWheelFocused);
  const { user, isAuthenticated } = useUser();

  // Control when queries should be enabled based on tab focus
  useFocusEffect(
    useCallback(() => {
      setIsWheelFocused(true);
      return () => {
        setIsWheelFocused(false);
      };
    }, []),
  );

  const handleSpin = async () => {
    if (isLoadingTarget) return;

    if (!isAuthenticated) {
      open({
        title: 'Please Login',
        content: 'You are currently not logged in. Please login to continue.',
        primaryButtonText: 'Login',
        onPrimaryClick: () => {
          console.log('Login button clicked, navigating to login page...');
          // Navigate to main-tabs -> tabs -> login
          globalNavig.navigate('auth', {
            screen: 'login',
          });
        },
      });
      return;
    }

    if (!user?.player_info?.real_name) {
      open({
        title: 'Notice',
        content:
          'Account Verification is required! your account is not yet verified. Verify now to access the Daily Lucky Spin features!',
        primaryButtonText: 'Verify Now',
        onPrimaryClick: () => {
          globalNavig.navigate('profile');
        },
      });
      return;
    }

    if (querySpinCount?.data?.data === 0) {
      open({
        title: t('wheel.notice.title') || 'Notice',
        content:
          t('wheel.notice.content') ||
          'Thank you for joining 11ic. Deposit min. 300 to get extra free spin and complete daily task for more chances of winning.',
        primaryButtonText: t('wheel.notice.primaryButtonText') || 'Deposit Now',
        onPrimaryClick: () => {
          console.log(
            'Deposit Now button clicked, navigating to deposit page...',
          );
          // Navigate to main-tabs -> tabs -> deposit-withdraw with deposit tab
          globalNavig.navigate('main-tabs', {
            screen: 'tabs',
            params: {
              screen: 'deposit-withdraw',
              params: { tab: 'deposit' },
            },
          });
        },
      });
      return;
    }

    try {
      setIsLoadingTarget(true);
      setTargetId(undefined);
      await querySpinResult
        .mutateAsync({
          player_id: user.player_info.player_id,
        })
        .then(res => {
          setTargetId(res.data.order);
          setIsLoadingTarget(false);
          querySpinCount.refetch();
          queryCheckInAndRewards[0].refetch();
          queryCheckInAndRewards[1].refetch();
        });
    } catch (error) {
      console.error('Failed to fetch target ID:', error);
      setIsLoadingTarget(false);
    }
  };

  const handleSpinComplete = (result: RouletteData) => {
    setTargetId(undefined);
    setTargetId(undefined);

    const isTryAgain =
      result.name.toLowerCase().includes('try again') ||
      result.name.toLowerCase().includes('tryagain');

    open({
      noAction: !isTryAgain, // Show buttons only for TRY AGAIN
      title: isTryAgain
        ? 'NOTICE'
        : t('wheel.notice.congratulations') || 'Congratulations!',
      content: (
        <View style={{ alignItems: 'center' }}>
          {!isTryAgain && (
            <Image
              source={require('../../assets/wheel/you-win.png')}
              style={{ width: 250, height: 104, resizeMode: 'contain' }}
            />
          )}
          <Text
            style={{
              fontSize: isTryAgain ? 32 : 24,
              fontWeight: '700',
              textTransform: 'uppercase',
              color: isTryAgain ? '#FFFFFF' : '#F3B867',
              textAlign: 'center',
              marginTop: isTryAgain ? 20 : 0,
            }}
          >
            {isTryAgain ? 'TRY AGAIN' : result.name}
          </Text>
        </View>
      ),
      // Add buttons for TRY AGAIN case
      ...(isTryAgain && {
        secondaryButtonText: 'OK',
        primaryButtonText: 'TRY AGAIN',
        onSecondaryClick: () => {
          // Just close the modal
        },
        onPrimaryClick: () => {
          // Retry the spin
          handleSpin();
        },
      }),
    });
  };

  const handleFreeSpinClick = () => {
    if (isAuthenticated && querySpinCount?.data?.data > 0) {
      claimFreeSpinMutation.mutate();
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        flexDirection: 'column',
      }}
    >
      <HeaderMessage />
      <WheelWrapper
        onRewardsClick={() => setCheckInDialog(true)}
        onFreeSpinClick={handleFreeSpinClick}
        freeSpinCount={isAuthenticated ? querySpinCount?.data?.data || 0 : 0}
        isFreeSpinLoading={
          isAuthenticated &&
          (querySpinCount?.isPending ||
            querySpinCount?.isFetching ||
            querySpinCount?.isRefetching ||
            claimFreeSpinMutation.isPending)
        }
        isAuthenticated={isAuthenticated}
      >
        <RouletteWheel
          data={queryPrizes?.data?.data || []}
          targetId={targetId}
          isLoadingTarget={isLoadingTarget}
          onSpin={handleSpin}
          onSpinComplete={handleSpinComplete}
          isLoadingPrizes={
            queryPrizes?.isPending ||
            queryPrizes?.isFetching ||
            queryPrizes?.isRefetching
          }
        />
      </WheelWrapper>
      <DailyDeposit />
      <Rules />
      <CheckInDialog
        open={checkInDialog}
        onClose={() => setCheckInDialog(false)}
      />
      <NoticeDialog />
    </ScrollView>
  );
}
