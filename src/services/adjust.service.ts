import { Platform } from 'react-native';
import { Adjust, AdjustConfig } from 'react-native-adjust';
import { NESTJS_API_BASE } from '@env';
import { apiRequest } from './api.config';
import { useUserStore } from '../store/useUser';

interface IAdjustEvent {
  device_id: string;
  adjust_id: string;
  event_name: string;
  app_name: string;
  agent_id: string;
}

interface intializeAdjust {
  token: string;
  app_name: string;
  agent_id: string;
  fb_app_id: string;
}

export const initializeAdjust = async (
  data: intializeAdjust,
): Promise<void> => {
  const { token, fb_app_id, ...adjustData } = data;
  return new Promise((resolve, reject) => {
    try {
      const adjustConfig = new AdjustConfig(
        token,
        AdjustConfig.EnvironmentProduction,
      );

      adjustConfig.setFbAppId(fb_app_id);
      adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
      adjustConfig.enableSendingInBackground();

      // Set up attribution callback
      adjustConfig.setAttributionCallback((attribution: any) => {
        console.log('Attribution callback received:', attribution);
      });

      // Initialize SDK
      Adjust.initSdk(adjustConfig);

      // Get Ad ID and send install event
      Adjust.getAdid((adjustAdid: string) => {
        useUserStore.getState().setAdjustId(adjustAdid);
        const payload: IAdjustEvent = {
          device_id: adjustAdid,
          adjust_id: adjustAdid,
          event_name: 'install',
          ...adjustData,
        };

        consumeAdjustEvent(payload).catch(error => {
          console.error('Failed to consume adjust event:', error);
        });
      });

      // Request tracking authorization on iOS
      if (Platform.OS === 'ios') {
        Adjust.requestAppTrackingAuthorization((status: number) => {
          console.log('Tracking authorization status:', status);
        });
      }

      resolve();
    } catch (error) {
      console.error('Error initializing Adjust SDK:', error);
      reject(error);
    }
  });
};

const consumeAdjustEvent = async (data: IAdjustEvent): Promise<void> => {
  try {
    await Promise.all([
      apiRequest.post({
        path: '/Misc/Adjust/Event',
        body: data,
      }),
      apiRequest.post({
        baseUrlOverride: NESTJS_API_BASE,
        body: { userId: data.adjust_id },
      }),
    ]);
  } catch (error) {
    console.error(
      'Error sending events:',
      error instanceof Error ? error.message : 'Unknown error occurred',
    );
    throw error;
  }
};
