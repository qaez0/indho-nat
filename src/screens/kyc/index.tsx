import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button } from '@ui-kitten/components';
import ContentHelper from './component/ContentHelper';
import UploadImg from './component/UploadImg';
import Note from './component/Note';
import DialogHelper, {
  type IDialogHelperProps,
} from './component/DialogHelper';
import type { IKycUploadImage, IKycUploadImageRequest } from '../../types/kyc';
import { yupResolver } from '@hookform/resolvers/yup';
import { kycUploadImage } from '../../schemas/kyc';
import { useForm } from 'react-hook-form';
import { useUser } from '../../hooks/useUser';
import {
  getUploadTitle,
  getStatusData,
  getDialogHelper,
} from '../../constants/kyc';
import type { KYCStatus } from '../../types/player';
import StatusUpdate from './component/StatusUpdate';
import { useKyc } from './useKyc';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useTopNavTitle } from '../../store/useUIStore';

const KYCScreen = () => {
  const [dialog, setDialogHelper] = useState<IDialogHelperProps | null>(null);
  const { updateKycRequest, loadingRequest } = useKyc();
  const { user, invalidate, isRefetching } = useUser();
  const idStatus = user?.player_info.kyc_id_status as KYCStatus;
  const bankStatus = user?.player_info.bank_id_status as KYCStatus;
  const bothPending = idStatus === 'PENDING' && bankStatus === 'PENDING';
  const bothApprove = idStatus === 'APPROVE' && bankStatus === 'APPROVE';
  const onePendingOneApprove =
    (idStatus === 'PENDING' && bankStatus === 'APPROVE') ||
    (idStatus === 'APPROVE' && bankStatus === 'PENDING');
  const { t } = useTranslation();
  const setTitle = useTopNavTitle(s => s.setTitle);

  useEffect(() => {
    setTitle('KYC Verification');
    return () => {
      setTitle(undefined);
    };
  }, []);

  const IDForm = useForm<IKycUploadImage>({
    resolver: yupResolver(kycUploadImage),
    mode: 'onChange',
  });
  const BankForm = useForm<IKycUploadImage>({
    resolver: yupResolver(kycUploadImage),
    mode: 'onChange',
  });

  if (bothPending || onePendingOneApprove) {
    return <StatusUpdate {...getStatusData(t, 'PENDING')} />;
  }

  if (bothApprove) {
    return <StatusUpdate {...getStatusData(t, 'APPROVE')} />;
  }

  const handleHelperDialog = (purpose: 'ID' | 'BANK') => {
    setDialogHelper({
      ...getDialogHelper(t)[purpose],
      open: true,
      onClose: () => setDialogHelper(null),
    });
  };

  const handleUploadKyc = async (
    id: 'kyc_id' | 'bank_id',
    data: IKycUploadImage,
  ) => {
    const payload: IKycUploadImageRequest = {
      files: data.kyc_img as File,
      collection: id,
    };
    updateKycRequest(payload, () => {
      invalidate('panel-info');
      if (id === 'kyc_id') {
        IDForm.reset();
      } else {
        BankForm.reset();
      }
    });
  };

  const onSubmit = async () => {
    const idNotApproveOrPending =
      idStatus !== 'APPROVE' && idStatus !== 'PENDING';
    const bankNotApproveOrPending =
      bankStatus !== 'APPROVE' && bankStatus !== 'PENDING';
    if (idNotApproveOrPending) {
      IDForm.trigger();
    }
    if (bankNotApproveOrPending) {
      BankForm.trigger();
    }

    Toast.show({
      type: 'promise',
      text1: 'Uploading documents...',
      autoHide: false,
    });
    await Promise.all([
      idNotApproveOrPending &&
        IDForm.handleSubmit(data => handleUploadKyc('kyc_id', data))(),
      bankNotApproveOrPending &&
        BankForm.handleSubmit(data => handleUploadKyc('bank_id', data))(),
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching.panelInfo}
          onRefresh={() => invalidate('panel-info')}
        />
      }
    >
      <View style={styles.content}>
        <ContentHelper
          title={t('kyc.upload-id')}
          onInfoClick={() => handleHelperDialog('ID')}
        >
          <UploadImg
            title={getUploadTitle('ID', user?.player_info.kyc_id_status, t)}
            form={IDForm}
            error={IDForm.formState.errors.kyc_img?.message}
            status={idStatus}
            isLoading={loadingRequest || isRefetching.panelInfo}
          />
        </ContentHelper>
        <ContentHelper
          title={t('kyc.upload-bank')}
          onInfoClick={() => handleHelperDialog('BANK')}
        >
          <UploadImg
            title={getUploadTitle('BANK', user?.player_info.bank_id_status, t)}
            form={BankForm}
            error={BankForm.formState.errors.kyc_img?.message}
            status={bankStatus}
            isLoading={loadingRequest || isRefetching.panelInfo}
          />
          <Button
            appearance="filled"
            status="success"
            onPress={onSubmit}
            disabled={
              (!IDForm.formState.isValid &&
                idStatus !== 'PENDING' &&
                idStatus !== 'APPROVE') ||
              (!BankForm.formState.isValid &&
                bankStatus !== 'PENDING' &&
                bankStatus !== 'APPROVE') ||
              onePendingOneApprove ||
              loadingRequest
            }
          >
            Submit
          </Button>
        </ContentHelper>
        <Note />
      </View>

      {dialog && <DialogHelper {...dialog} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    padding: 15,
  },
  content: {
    flex: 1,
    gap: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  button: {
    marginTop: 8,
  },
});

export default KYCScreen;
