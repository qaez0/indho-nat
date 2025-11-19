import appsFlyer, { InitSDKOptions } from 'react-native-appsflyer';
import DeviceInfo from 'react-native-device-info';
import { apiRequest } from './api.config';

export const initializeAppsFlyer = async (options: InitSDKOptions) => {
  appsFlyer.initSdk(
    options,
    result => {
      console.log('appsflyer result', result);
    },
    error => {
      console.error('appsflyer error', error);
    },
  );
  const userId = await DeviceInfo.getAndroidId();
  appsFlyer.setCustomerUserId(userId, result => {
    console.log('Customer User ID set:', result);
  });

  const appsFlyerUID = await new Promise<string>(resolve => {
    appsFlyer.getAppsFlyerUID((err, uid) => {
      console.log('uid', uid);
      if (err) {
        console.error('Error getting AppsFlyer UID:', err);
        resolve(userId);
      } else {
        resolve(uid);
      }
    });
  });

  const appsFlyerInstallAttri = await new Promise<any>(resolve => {
    appsFlyer.onInstallConversionData(data => {
      const attributionData = {
        ...data,
        media_source: data.data?.media_source || 'organic',
        campaign: data.data?.campaign || 'none',
        af_status: data.data?.af_status || 'organic',
        is_first_launch: data.data?.is_first_launch || false,
      };
      console.log('appsflyer install attribution data', data);
      resolve(attributionData);
    });
  });
  console.log('appsflyer install attribution data', appsFlyerInstallAttri);

  const alreadyInstalledUserId = (await getAlreadyInstalledUserId()).map(
    (item: { userId: string }) => item.userId,
  );

  console.log('alreadyInstalledUserId', alreadyInstalledUserId);
  if (!alreadyInstalledUserId.includes(userId)) {
    const payload: IAppsFlyerPayload = {
      cuid: userId,
      afid: appsFlyerUID,
      media_source: appsFlyerInstallAttri.media_source,
      campaign: appsFlyerInstallAttri.campaign,
      install_type: appsFlyerInstallAttri.af_status,
      is_first_launch: appsFlyerInstallAttri.is_first_launch,
    };
    console.log('AppsFlyerInstallEvent', payload);
    AppsFlyerInstallEvent(payload);
  }
};

interface IAppsFlyerPayload {
  cuid: string;
  afid: string;
  media_source: string;
  campaign: string;
  install_type: string;
  is_first_launch: boolean;
}
const AppsFlyerInstallEvent = async (data: IAppsFlyerPayload) => {
  console.log('data', data);
  try {
    await apiRequest.post({
      path: '/Misc/Appsflyer/Event',
      body: {
        ...data,
        event_name: 'install',
      },
    });
    await apiRequest.post({
      path: '/api/first-install',
      baseUrlOverride: 'https://11icinrvivo.fortune-flick.com',
      body: {
        userId: data.cuid,
      },
    });
  } catch (error) {
    console.error('Error sending appsflyer event:', error);
  }
};

const getAlreadyInstalledUserId = async () => {
  const response = await fetch(
    'https://11icinrvivo.fortune-flick.com/api/first-install',
  );
  return response.json();
};
