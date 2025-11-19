import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import Clipboard from '@react-native-clipboard/clipboard';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ViewShot from 'react-native-view-shot';
import { useRef } from 'react';
import { hasAndroidPermission } from '../../../utils/permissions';
import Toast from 'react-native-toast-message';
import Feather from '@react-native-vector-icons/feather';

interface IUsdtAddressCardProps {
  address: string;
  image: string;
  title: string;
}

const UsdtAddressCard = ({ address, image, title }: IUsdtAddressCardProps) => {
  const viewShotRef = useRef<ViewShot | null>(null);

  const handleSaveQR = async () => {
    try {
      // Check Android permissions
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        Toast.show({
          type: 'error',
          text1: 'Permission not granted',
          text2: 'Please allow storage permission to save QR code',
        });
        return;
      }

      const node = viewShotRef.current;
      if (!node || typeof (node as any).capture !== 'function') {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Unable to capture QR code',
        });
        return;
      }

      // Capture the QR code as an image
      const uri = await (node as any).capture();

      // Save to camera roll/gallery
      await CameraRoll.save(uri, { type: 'photo' });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'QR code saved to gallery',
      });
    } catch (error) {
      console.error('Error saving QR code:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save QR code',
      });
    }
  };

  const handleCopyAddress = async () => {
    try {
      Clipboard.setString(address);
      Toast.show({
        type: 'success',
        text1: 'Copied',
        text2: 'Address copied to clipboard',
      });
    } catch (error) {
      console.error('Error copying address:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to copy address',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.qrCodeWrapper}>
        <ViewShot
          ref={viewShotRef}
          options={{
            format: 'jpg',
            quality: 0.9,
          }}
        >
          <View style={styles.qrCodeContainer}>
            <Image
              source={{ uri: image }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>
        </ViewShot>
      </View>
      <View style={styles.dataContent}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>{title}</Text>
          <Button onPress={handleSaveQR} style={styles.saveButton} size="tiny">
            {() => <Text style={styles.saveQrLabel}>SAVE QR</Text>}
          </Button>
        </View>
        <TouchableOpacity
          style={styles.copyContainer}
          onPress={handleCopyAddress}
          activeOpacity={0.7}
        >
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
            {address}
          </Text>
          <View style={styles.iconContainer}>
            <Feather name="copy" size={10} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UsdtAddressCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 17,
    backgroundColor: '#2E4F62', // Simplified gradient - you can use react-native-linear-gradient for actual gradient
    padding: 10,
    paddingHorizontal: 15,
    minHeight: 108,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  qrCodeWrapper: {
    flexShrink: 0,
  },
  dataContent: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrCodeContainer: {
    padding: 4,
    width: 88,
    height: 88,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500',
    color: '#F3B867',
  },
  saveButton: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 20,
    minWidth: 60,
    borderWidth: 0,
  },
  saveQrLabel: {
    fontFamily: 'Montserrat',
    fontSize: 8,
    fontWeight: '600',
    color: '#000',
  },
  address: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '400',
    color: '#F3B867',
    flex: 1,
    marginRight: 8,
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 13,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 15,
    width: 15,
    borderRadius: 7.5,
    backgroundColor: '#F3B867',
    flexShrink: 0,
  },
  icon: {
    fontSize: 10,
    color: '#FFFFFF',
  },
});
