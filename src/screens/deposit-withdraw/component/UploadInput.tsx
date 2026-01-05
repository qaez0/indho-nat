import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useUploadFiles } from '../store';
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import AddIcon from '../../../assets/dep-with/add.svg';
import AddeIcon from '../../../assets/dep-with/added.svg';

interface UploadInputProps {
  name: string;
  form: UseFormReturn<any>;
}

const UploadInput = ({ form, name, uploadKey }: UploadInputProps) => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    formState: { errors },
  } = form;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const value = watch(name);

// Subscribe to Zustand store for files and version
  // Subscribe to files object and version to trigger re-renders when uploads change
  const files = useUploadFiles(state => state.files);
  const version = useUploadFiles(state => state.version);
  const setFile = useUploadFiles(state => state.setFile);
  const clearFile = useUploadFiles(state => state.clearFile);

  // Get the stored file for this upload key
  const storedFile = files[uploadKey] || null;

  // Show preview only when both form value and stored file are present
  const hasImage = value && value.uri && storedFile;

  // Sync Zustand store with form value
  useEffect(() => {
    console.log(value);
    if (value && value.uri) {
      // Form has a value - store it in Zustand
      setFile(uploadKey, value);
    } else {
      // Form value cleared - clear from Zustand to keep UI/validation aligned
      clearFile(uploadKey);
    }
  }, [value, uploadKey, setFile, clearFile]);

  const handleImagePicker = (onChange: (file: any) => void) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 1920,
      maxWidth: 1920,
      quality: 0.8,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select image');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const fileData = {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
        // Update form value (which will trigger Zustand sync via useEffect)
        onChange(fileData);
      }
    });
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field: { onChange, value } }) => (
        <View style={styles.mainContainer}>
          {errors[name]?.message && (
            <Text style={styles.error}>{String(errors[name]?.message)}*</Text>
          )}
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.dropzone}
              onPress={() => handleImagePicker(onChange)}
              activeOpacity={0.7}
            >
              {hasImage ? <AddeIcon style={styles.uploadIcon}/> : <AddIcon style={styles.uploadIcon}/>}
            </TouchableOpacity>
            <Text style={styles.typography}>
              {t('deposit-withdraw.upload-input.suggested-image-size') ||
                'Suggested image size is 1 MB; supported formats are JPG and PNG.'}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

export default UploadInput;

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    minHeight: 80,
    padding: 16,
    backgroundColor: 'transparent',
  },
  uploadIcon: {
    width: 24,
    height: 24,
    tintColor: 'rgba(255, 255, 255, 0.6)',
  },
  typography: {
    fontFamily: 'Montserrat',
    fontSize: 9,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  error: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
  },
});
