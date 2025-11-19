import { useTheme } from '@ui-kitten/components';
import AddBtn from './component/AddBtn';
import Card from './component/Card';
import { RefreshControl, ScrollView, View } from 'react-native';
import { walletManagementModalFields } from '../../constants/wallet-management';
import { useBottomDrawer } from '../../hooks/useUIHelpers';
import BottomDrawer from '../../components/BottomDrawer';
import FormHelper from '../../components/FormHelper';
import { useFormHelper } from '../../hooks/useFormHelper';
import { useUser } from '../../hooks/useUser';
import { getMenuLists } from '../../services/user.service';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

const WalletManagementScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const openDialog = useBottomDrawer(state => state.openDialog);
  const closeDialog = useBottomDrawer(state => state.closeDialog);
  const config = useBottomDrawer(state => state.config);
  const { getForm } = useFormHelper();
  const { user, invalidate, isRefetching } = useUser();
  const cards = user?.bank_info;

  const { data: menuLists } = useQuery({
    queryKey: ['menuLists'],
    queryFn: () => getMenuLists(),
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: 'column',
        gap: 8,
        padding: 15,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching.panelInfo}
          onRefresh={() => invalidate('panel-info')}
        />
      }
    >
      <View
        style={{
          flexDirection: 'column',
          gap: 15,
          backgroundColor: theme['bg-secondary'],
        }}
      >
        <AddBtn
          onAdd={() =>
            openDialog(
              walletManagementModalFields('bank', menuLists?.data.banks),
            )
          }
          text={t('wallet-management.add-bank-card')}
        />
        <AddBtn
          onAdd={() =>
            openDialog(
              walletManagementModalFields('ewallet', menuLists?.data.ewallet),
            )
          }
          text={t('wallet-management.add-e-wallet')}
        />
        <AddBtn
          onAdd={() =>
            openDialog(
              walletManagementModalFields(
                'usdt',
                [],
                user?.player_info?.real_name,
              ),
            )
          }
          text={t('wallet-management.add-usdt-address')}
        />
        <View style={{ flexDirection: 'column', gap: 8 }}>
          {cards?.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </View>
      </View>

      {config && (
        <BottomDrawer>
          <FormHelper
            onClose={closeDialog}
            {...config}
            {...getForm(config?.form_id as keyof typeof getForm)}
          />
        </BottomDrawer>
      )}
    </ScrollView>
  );
};

export default WalletManagementScreen;
