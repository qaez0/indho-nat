import {
  getApiLevel,
  getDevice,
  getDeviceId,
  getDeviceName,
  getDeviceType,
  getSystemVersion,
} from 'react-native-device-info';
import { IDevice } from '../types/device';

async function safeGet<T>(fn: () => T | Promise<T>, fallback: T): Promise<T> {
  try {
    const value = await Promise.resolve(fn()); // normalize sync/async
    if (value === null || value === undefined) {
      return fallback;
    }

    if (typeof value === 'string') {
      const sanitized = value
        .replace(/['"`]/g, '')
        .replace(/[^\w\s.-]/g, '')
        .trim();
      return (sanitized || fallback) as T;
    }

    return value as T;
  } catch {
    return fallback;
  }
}

export const getBasicDeviceInfo = async (): Promise<IDevice> => {
  const rawDeviceId = await safeGet(() => getDeviceId(), '0'); // works, even though sync
  const deviceId = Number(rawDeviceId);

  const device: IDevice = {
    device_id: isNaN(deviceId) ? 0 : deviceId,
    device_info: await safeGet(() => getDevice(), 'Unknown'),
    fingerprintMethod: 'client-side' as const,
    origin_url: 'https://11ic.pk',
    enhancedDeviceInfo: {
      browserName: 'Mobile app',
      browserVersion: '1.0.0',
      incognito: false,
      os: await safeGet(() => `Android v${getSystemVersion()}`, 'Android'),
      deviceType: await safeGet(() => getDeviceType(), 'Unknown'),
      device: await safeGet(() => getDeviceName(), 'Unknown Device'),
      deviceApiValue: await safeGet(() => getApiLevel(), 0),
    },
  };

  return device;
};
