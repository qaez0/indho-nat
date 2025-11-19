import { BASE_URL } from '@env';
import { useUserStore } from '../store/useUser';
import {
  ENDPOINTS_REQUIRING_IP,
  ENDPOINTS_TRIGGERING_LOGOUT_ON_401,
} from '../constants/api';
import Toast from 'react-native-toast-message';
import { getUserAgent } from 'react-native-device-info';
import { navigateToLogin } from '../utils/navigation';
import deviceInfo from 'react-native-device-info';
import { useLastRequestPayload } from '../store/useUIStore';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface APIRequestOptions {
  path?: string;
  body?: any;
  customHeaders?: Record<string, string>;
  params?: Record<string, string | number>;
  tokenOverride?: string;
  baseUrlOverride?: string;
}

async function request<T = any>(
  method: HTTPMethod,
  {
    path,
    body,
    customHeaders = {},
    params,
    tokenOverride,
    baseUrlOverride,
  }: APIRequestOptions,
): Promise<T> {
  let query = '';
  if (params && Object.keys(params).length > 0) {
    const parts: string[] = [];
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = (params as Record<string, string | number>)[key];
        parts.push(
          encodeURIComponent(key) + '=' + encodeURIComponent(String(value)),
        );
      }
    }
    if (parts.length > 0) {
      query = '?' + parts.join('&');
    }
  }
  const providedBase = baseUrlOverride ?? BASE_URL;
  const normalizedBaseUrl = (typeof providedBase === 'string' && providedBase.endsWith('/'))
    ? providedBase.slice(0, -1)
    : providedBase;
  const url = `${normalizedBaseUrl}${path || ''}${query}`;
  const token = tokenOverride ?? useUserStore.getState().token?.auth_token;
  const userAgent = await getUserAgent();

  const headers: Record<string, string> = {
    Origin: 'https://11ic.pk',
    Referer: normalizedBaseUrl + (path || ''),
    'User-Agent': userAgent,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  // Only add Content-Type for non-FormData requests
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (path && ENDPOINTS_REQUIRING_IP.some(e => path.includes(e))) {
    try {
      let ipaddress = '';
      const deviceInfoIP = await deviceInfo.getIpAddress();
      if (deviceInfoIP !== 'unknown') {
        ipaddress = deviceInfoIP;
      } else {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          ipaddress = data.ip;
        }
      }
      body = {
        ...body,
        ipaddress,
      };
    } catch (error) {
      console.error(error);
    }
  }

  // Save request payload for debugging
  const requestPayload = {
    method,
    url,
    headers,
    body: method !== 'GET' ? body : undefined,
    timestamp: new Date().toISOString(),
  };
  useLastRequestPayload.getState().savePayload(requestPayload);
  
  const response = await fetch(url, {
    method,
    headers,
    body:
      method !== 'GET' && body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
  });

  console.log(response, 'response');
  if (!response.ok) {
    if (
      response.status === 401 &&
      path &&
      (ENDPOINTS_TRIGGERING_LOGOUT_ON_401.some(endpoint =>
        path.includes(endpoint),
      ) ||
        path.includes('GameLogin'))
    ) {
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Please login again',
        onShow: async () => {
          await useUserStore
            .getState()
            .logout()
            .finally(() => {
              navigateToLogin();
            });
        },
      });
    }
    const errorMessage = await response.text();
    try {
      const errorJson = JSON.parse(errorMessage);
      throw new Error(errorJson.message || errorMessage);
    } catch (e) {
      throw new Error(errorMessage || `HTTP error: ${response.status}`);
    }
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return (await response.text()) as unknown as T;
}

export const apiRequest = {
  get: <T = any>(options: APIRequestOptions) => request<T>('GET', options),
  post: <T = any>(options: APIRequestOptions) => request<T>('POST', options),
  put: <T = any>(options: APIRequestOptions) => request<T>('PUT', options),
  delete: <T = any>(options: APIRequestOptions) =>
    request<T>('DELETE', options),
  patch: <T = any>(options: APIRequestOptions) => request<T>('PATCH', options),
};
