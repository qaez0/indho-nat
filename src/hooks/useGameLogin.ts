import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useUser } from './useUser';
import {
  useAuthModal,
  useGameDisplay,
  useGlobalLoader,
} from '../store/useUIStore';
import Toast from 'react-native-toast-message';
import { getMillisecondsUntilTenSecondsAfter } from '../utils/countdown';
import { apiRequest } from '../services/api.config';
import { IBaseResponse } from '../types/api';
import { useNavigation } from '@react-navigation/native';
import { RootStackNav } from '../types/nav';
import { ISlot } from '../types/slot';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

type InitStatus = 'aborted' | 'success' | 'failed';

export const useGameLogin = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useUser();
  const { t } = useTranslation();
  const openLoader = useGlobalLoader(state => state.openLoader);
  const closeLoader = useGlobalLoader(state => state.closeLoader);
  const openAuthModal = useAuthModal(state => state.openDialog);
  const setGameUrl = useGameDisplay(state => state.setGameUrl);
  const lastUsedGame = useGameDisplay(state => state.last_used_game);
  const rawDataCurrentGame = useGameDisplay(state => state.data);
  const navigation = useNavigation<RootStackNav>();

  const waitForBalanceFetching = async (
    client: QueryClient,
  ): Promise<void> => {
    return new Promise(resolve => {
      const check = () => {
        const fetching = client.isFetching({ queryKey: ['balance'] });
        if (fetching === 0) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  };

  const initializeGame = async (
    data: ISlot,
    _isReload: boolean = false,
    id?: string,
  ): Promise<InitStatus> => {
    console.log('INTIALIZE', data)
    if (data.url === '' || data.url === null) {
      Toast.show({
        type: 'error',
        text1: t('common-terms.something-went-wrong'),
      });
      return 'aborted';
    }
    if (!isAuthenticated) {
      openAuthModal();
      return 'aborted';
    }
    openLoader(t('common-terms.please-wait'));

    if (queryClient.isFetching({ queryKey: ['balance'] })) {
      Toast.show({
        type: 'promise',
        text1: t('common-terms.fetching-balance'),
      });
      await waitForBalanceFetching(queryClient).finally(() => {
        Toast.hide();
      });
    }

    if (lastUsedGame?.date) {
      const timeLeft = getMillisecondsUntilTenSecondsAfter(lastUsedGame.date);
      if (timeLeft > 0) {
        openLoader(t('common-terms.transferring'));
        setTimeout(() => {
          initializeGame(data);
        }, timeLeft);
        return 'failed';
      }
    }

    try {
      openLoader(t('common-terms.game-loading'));
      console.log

      const response = await apiRequest.get<IBaseResponse<string>>({
        path: data.url,
        ...(data.game_id === 'PG' && {
          // baseUrlOverride: 'http://cap1.11ic.pk/capi',
        }),
      });

      console.log(response)
      let game: string;
      if (response.data && response.data.startsWith('/capi')) {
        game = `http://cap1.11ic.pk${response.data}`;
      } else {
        game = response.data;
      }

      console.log(game)
      if (data.url.includes('nw/lobby')) {
        Linking.openURL(game);
        return 'success';
      }
      if (id) {
        setGameUrl({
          ...data,
          game_url: `${game}/#markets/cricket/${id}`,
        });
      } else {
        setGameUrl({
          ...data,
          game_url: game,
        });
      }
      navigation.navigate('game');
      return 'success';
    } catch (e: any) {
      console.log(e)
      const errorMessage =
        JSON.parse(e.message).message || t('common-terms.something-went-wrong');

      if (errorMessage === 'invalid_token') {
        Toast.show({
          type: 'error',
          text1: t('common-terms.session-expired'),
          text2: t('common-terms.please-login-again'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: errorMessage,
        });
      }

      return 'failed';
    } finally {
      closeLoader();
    }
  };

  const reloadGame = async () => {
    if (rawDataCurrentGame) {
      initializeGame(rawDataCurrentGame, true);
    }
  };

  return {
    initializeGame,
    reloadGame,
  };
};
