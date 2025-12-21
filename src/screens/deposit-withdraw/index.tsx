import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, useTheme } from '@ui-kitten/components';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import DepWithCustomDialog from './Dialog';
import { useUser } from '../../hooks/useUser';
import type {
  IPlayerDetails,
  IPlayerTransactionInfo,
} from '../../types/player';
import { useDepWith } from './store';
import { useRoute, RouteProp } from '@react-navigation/native';
import { TabsParamList } from '../../types/nav';
import { useEffect } from 'react';
import { useAuthModal } from '../../store/useUIStore';
import { useTranslation } from 'react-i18next';

const DepositWithdrawScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, invalidate, isLoading, isRefetching, isAuthenticated } =
    useUser();
  const { activeTab, setActiveTab } = useDepWith();
  const route = useRoute<RouteProp<TabsParamList, 'deposit-withdraw'>>();
  const initialTab = route.params?.tab;
  const openAuthModal = useAuthModal(state => state.openDialog);

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal();
    }
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, setActiveTab, route, isAuthenticated, openAuthModal]);

  const payment_channels_group = user?.payment_channels_group;
  const bankTransfer = payment_channels_group?.bankTransfer || [];
  const bankTransferUpi = payment_channels_group?.bankTransfer_upi || [];
  const onlinePay = payment_channels_group?.onlinePay || [];
  const crypto = payment_channels_group?.crypto || [];
  const playerInfo = user?.player_info || {};
  const bankInfo = user?.bank_info || [];
  const transactionInfo = user?.transaction_info || {};

  // FAST PAY (eWallet) shows "Mega" channels and DY_EASYPAISA
  // E-WALLET (easyPay) shows other "DY" channels (excluding DY_EASYPAISA)
  const fastPayChannelIds = new Set([
    'DY_EASYPAISA',
    'TOPPAY_EASYPAISA',
    'TOPPAY_JAZZCASH',
    'GAMEPAYER_EASYPAISA',
    'GAMEPAYER_JAZZCASH',
  ]);
  const filteredOnlinePayMega = onlinePay.filter(channel => {
    const name = (channel.display_name || '').toLowerCase();
    return name.includes('mega') || fastPayChannelIds.has(channel.channel_id);
  });
  const fastPay = filteredOnlinePayMega;
  const eWallet = onlinePay.filter(channel => 
    channel.display_name === 'DY' &&
    channel.channel_id !== "DY_EASYPAISA");

  const details = {
    eWallet: eWallet,
    fastPay: fastPay,
    easyPay: bankTransferUpi,
    crypto: crypto,
    bankTransfer: bankTransfer,
    playerInfo: playerInfo as IPlayerDetails,
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            ...styles.naviContainer,
            backgroundColor: '#272727',
          }}
        >
          <Button
            onPress={() => {
              setActiveTab('deposit');
              invalidate('panel-info');
            }}
            style={[
              styles.naviButtonBase,
              {
                backgroundColor:
                  activeTab === 'deposit'
                    ? theme['color-success-500']
                    : '#1a1a1a',
                borderWidth: activeTab === 'deposit' ? 0 : 1,
                borderColor: activeTab === 'deposit' ? 'transparent' : '#333',
              },
            ]}
            appearance="filled"
            status="basic"
          >
            {(evaProps: any) => (
              <Text
                {...evaProps}
                style={[
                  evaProps?.style,
                  {
                    color: activeTab === 'deposit' ? '#23272f' : '#fff',
                    fontWeight: activeTab === 'deposit' ? '700' : '500',
                  },
                ]}
              >
                {t('common-terms.deposit')}
              </Text>
            )}
          </Button>
          <Button
            appearance="filled"
            style={[
              styles.naviButtonBase,
              {
                backgroundColor:
                  activeTab === 'withdraw'
                    ? theme['color-success-500']
                    : '#1a1a1a',
                borderWidth: activeTab === 'withdraw' ? 0 : 1,
                borderColor: activeTab === 'withdraw' ? 'transparent' : '#333',
              },
            ]}
            status="basic"
            onPress={() => {
              setActiveTab('withdraw');
              invalidate('panel-info');
            }}
          >
            {(evaProps: any) => (
              <Text
                {...evaProps}
                style={[
                  evaProps?.style,
                  {
                    color: activeTab === 'withdraw' ? '#23272f' : '#fff',
                    fontWeight: activeTab === 'withdraw' ? '700' : '500',
                  },
                ]}
              >
                {t('common-terms.withdraw')}
              </Text>
            )}
          </Button>
        </View>
        {activeTab === 'deposit' && (
          <View>
            <Deposit
              details={details}
              isLoading={isLoading.panelInfo}
              refetch={() => invalidate('panel-info')}
              isRefetching={isRefetching.panelInfo}
              isAuthenticated={isAuthenticated}
            />
          </View>
        )}
        {activeTab === 'withdraw' && (
          <View>
            <Withdraw
              bankInfo={bankInfo}
              playerInfo={playerInfo as IPlayerDetails}
              transactInfo={transactionInfo as IPlayerTransactionInfo}
              isLoading={isLoading.panelInfo}
              isRefetching={isRefetching.panelInfo}
              refetch={() => invalidate('panel-info')}
            />
          </View>
        )}

        <DepWithCustomDialog />
      </View>
    </ScrollView>
  );
};

export default DepositWithdrawScreen;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    flexGrow: 1,
  },
  naviContainer: {
    flexDirection: 'row',
    backgroundColor: '#272727',
    borderRadius: 16,
    padding: 10,
    gap: 10,
  },
  naviButtonBase: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
});
