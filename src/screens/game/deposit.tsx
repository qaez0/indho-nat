import { ScrollView } from 'react-native';
import Deposit from '../deposit-withdraw/Deposit';
import { useUser } from '../../hooks/useUser';
import { IPlayerDetails } from '../../types/player';
import QuitModal from './components/QuitModal';
import { useGameDisplay } from '../../store/useUIStore';
import { useNavigation } from '@react-navigation/native';
import { GameNav } from '../../types/nav';

const InGameDepositScreen = () => {
  const { isAuthenticated } = useUser();
  const navigation = useNavigation<GameNav>();
  const { invalidate, isRefetching, isLoading, user } = useUser();
  const setDepositGateway = useGameDisplay(state => state.setDepositGateway);

  const handleDepositGateway = (url: string) => {
    setDepositGateway(url);
    navigation.navigate('payment-gateway');
  };

  const payment_channels_group = user?.payment_channels_group;
  const bankTransfer = payment_channels_group?.bankTransfer || [];
  const bankTransferUpi = payment_channels_group?.bankTransfer_upi || [];
  const onlinePay = payment_channels_group?.onlinePay || [];
  const crypto = payment_channels_group?.crypto || [];
  const playerInfo = user?.player_info || {};

  // FAST PAY (eWallet) shows "Mega" channels and DY_EASYPAISA
  // E-WALLET (easyPay) shows other "DY" channels (excluding DY_EASYPAISA)
  const fastPayChannelIds = new Set([
    'DY_EASYPAISA',
    'TOPPAY_EASYPAISA',
    'TOPPAY_JAZZCASH',
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
    <ScrollView
      contentContainerStyle={{
        flexDirection: 'column',
        gap: 8,
        padding: 15,
      }}
    >
      <Deposit
        details={details}
        isLoading={isLoading.panelInfo}
        refetch={() => invalidate('panel-info')}
        isRefetching={isRefetching.panelInfo}
        isAuthenticated={isAuthenticated}
        openInIframe={handleDepositGateway}
      />
      <QuitModal />
    </ScrollView>
  );
};

export default InGameDepositScreen;
