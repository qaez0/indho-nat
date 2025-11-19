import { useState } from 'react';
import Toast from 'react-native-toast-message';
interface IKycUploadImageRequest {
  files: File | any;
  collection: string;
}
import { uploadKycImage } from '../../services/user.service';

export const useKyc = () => {
  const [isPending, setIsPending] = useState(false);

  const updateKycRequest = async (
    payload: IKycUploadImageRequest,
    onSucc: () => void,
  ) => {
    try {
      setIsPending(true);

      const formData = new FormData();
      formData.append('files', payload.files as any);
      formData.append('collection', payload.collection);
      const response = await uploadKycImage(formData);
      if (typeof response.data === 'boolean' && response.data === false) {
        Toast.show({
          type: 'error',
          text1:
            response.message.charAt(0).toUpperCase() +
            response.message.slice(1),
        });
        return;
      }

      onSucc();
      Toast.show({
        type: 'success',
        text1: 'Documents uploaded successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to upload documents',
      });
      console.error('KYC upload error:', error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    updateKycRequest,
    loadingRequest: isPending,
  };
};
