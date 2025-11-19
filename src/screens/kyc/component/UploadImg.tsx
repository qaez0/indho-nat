import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@ui-kitten/components';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { DEFAULT_IMAGE, STATUS_IMAGES } from '../../../constants/kyc';
import { 
  launchImageLibrary, 
  ImagePickerResponse, 
  ImageLibraryOptions 
} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

// Inline types to avoid import issues
interface IKycUploadImage {
  kyc_img: File | any;
}

type KYCStatus = 'PENDING' | 'APPROVE' | 'DECLINE';

interface IProps {
  title: string;
  form: UseFormReturn<IKycUploadImage>;
  error?: string;
  status?: KYCStatus;
  isLoading?: boolean;
}

const UploadImg = ({ title, form, error, status, isLoading }: IProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | number>(DEFAULT_IMAGE);

  useEffect(() => {
    const subscription = form.watch(
      (value: any, { name }: { name?: string }) => {
        if (name === 'kyc_img' && !value.kyc_img) {
          setSelectedFile(null);
          setPreviewUrl(DEFAULT_IMAGE);
        }
      },
    );
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [form]);

  const handleImagePick = useCallback(
    (onChange: (file: any) => void) => {
      const isEditable = status !== 'PENDING' && status !== 'APPROVE';
      if (!isEditable || isLoading) return;

      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
        selectionLimit: 1,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          return;
        }

        if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Toast.show({
            type: 'error',
            text1: 'Image picker error',
            text2: response.errorMessage,
          });
          return;
        }

        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          const fileName = asset.fileName || `image_${Date.now()}.jpg`;
          
          // Validate file size (5MB limit)
          const maxSize = 5 * 1024 * 1024; // 5MB in bytes
          if (asset.fileSize && asset.fileSize > maxSize) {
            Toast.show({
              type: 'error',
              text1: 'File too large',
              text2: 'Please select an image smaller than 5MB',
            });
            return;
          }
          
          // Update preview state
          setSelectedFile(fileName);
          setPreviewUrl(asset.uri || '');
          
          // Create file object for form submission
          const file = {
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            name: fileName,
            size: asset.fileSize,
          };
          
          onChange(file);
          
          Toast.show({
            type: 'success',
            text1: 'Image selected',
            text2: fileName,
          });
        }
      });
    },
    [status],
  );

  const isError = Boolean(error);
  const displayText = error || selectedFile || title;
  const imageSrc: string | number =
    status && status in STATUS_IMAGES
      ? STATUS_IMAGES[status as keyof typeof STATUS_IMAGES]
      : previewUrl;
  const textColor = isError
    ? '#FF4D4F'
    : status === 'APPROVE'
    ? '#F3B867'
    : '#FFFFFF';

  return (
    <Controller
      name="kyc_img"
      control={form.control}
      render={({ field: { onChange } }) => (
        <TouchableOpacity
          style={[styles.container, isError && styles.errorBorder]}
          onPress={() => handleImagePick(onChange)}
        >
          <Image
            source={typeof imageSrc === 'number' ? imageSrc : { uri: imageSrc }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={[styles.text, { color: textColor }]}>{displayText}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 10,
    minHeight: 152,
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#363636',
  },
  errorBorder: {
    borderColor: '#FF4D4F',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'center',
    minHeight: 16,
  },
});

export default UploadImg;
