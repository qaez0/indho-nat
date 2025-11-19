export interface IDevice {
  device_id: number;
  device_info: string;
  fingerprintMethod: 'client-side' | 'server-side';
  origin_url: string;
  enhancedDeviceInfo: IEnhancedDeviceInfo;
}
export interface IEnhancedDeviceInfo {
  browserName: string;
  browserVersion: string;
  incognito: boolean;
  os: string;
  deviceType: string;
  device: string;
  deviceApiValue: number;
}
