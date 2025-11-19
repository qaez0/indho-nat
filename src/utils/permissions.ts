import { PermissionsAndroid, Platform } from 'react-native';

export async function hasAndroidPermission() {
  if (Platform.OS !== 'android') return true;

  // Android 13+ uses READ_MEDIA_IMAGES
  if (Platform.Version >= 33) {
    const mediaImages = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
    const hasImages = await PermissionsAndroid.check(mediaImages);
    if (hasImages) return true;
    const status = await PermissionsAndroid.request(mediaImages);
    return status === 'granted';
  }

  // Android 10-12: READ_EXTERNAL_STORAGE is enough for saving via scoped storage
  const read = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  const hasRead = await PermissionsAndroid.check(read);
  if (hasRead) return true;
  const readStatus = await PermissionsAndroid.request(read);
  if (readStatus === 'granted') return true;

  // Fallback for very old devices where WRITE is required
  const write = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  const hasWrite = await PermissionsAndroid.check(write);
  if (hasWrite) return true;
  const writeStatus = await PermissionsAndroid.request(write);
  return writeStatus === 'granted';
}
