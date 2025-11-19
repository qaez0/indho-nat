import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { getSportsMenu } from '../../constants/sports';
import { useTranslation } from 'react-i18next';
import { imageHandler } from '../../utils/image-url';
import { useSlots } from '../../hooks/useSlots';
import { ISlot } from '../../types/slot';
import Content from '../../components/Content';
import ButtonOption from '../../components/game/ButtonOption';
import SportsSvg from '../../assets/common/content-icons/sports.svg';
import { useGameLogin } from '../../hooks/useGameLogin';
import { TabsParamList } from '../../types/nav';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { useAuthModal, useCurrentRoute } from '../../store/useUIStore';
import { useUser } from '../../hooks/useUser';
import React from 'react';

export default function SportsPage() {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [activeSports, setActiveSports] = useState<string>('all');
  const [loading, setLoading] = useState<string | null>(null);
  const { t } = useTranslation();
  const { initializeGame } = useGameLogin();
  const route = useRoute<RouteProp<TabsParamList, 'sports'>>();
  const currentRoute = useCurrentRoute(state => state.currentRoute);
  const from = route.params?.from;
  const { isAuthenticated } = useUser();
  const openAuthModal = useAuthModal(state => state.openDialog);

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (from === 'bottom-tab') {
      initializeGame({
        url: '/Login/GameLogin/ob/lobby',
      } as ISlot);
    }
  }, [from, route]);

  const {
    state,
    data: sportsGames,
    dispatch,
    isLoading: isLoadingSports,
    isFetching: isFetchingSports,
    isRefetching: isRefetchingSports,
  } = useSlots({
    name: '',
    category: 'SPORTS',
    game_id: '',
    page: 1,
    pagesize: 10,
  });

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (state.game_id !== '') {
          dispatch({
            type: 'RESET_FILTER',
            payload: {
              name: '',
              category: 'SPORTS',
              game_id: '',
              page: 1,
              pagesize: 10,
            },
          });
          setActiveSports('all');
        }
      };
    }, [currentRoute]),
  );

  const gameList = sportsGames?.data?.data || [];
  const filteredGameList = gameList.filter((g: ISlot) => !String(g?.url || '').includes('/ls/'));
  const listLoading = isLoadingSports || isFetchingSports || isRefetchingSports;

  const handleGameClick = async (sports: ISlot) => {
    setLoading(sports.game_id);
    await initializeGame(sports).finally(() => {
      setLoading(null);
    });
  };

  const handleGameSelection = async (game_id: string) => {
    setActiveSports(game_id);
    dispatch({
      type: 'SET_GAME_ID',
      payload: game_id === 'all' ? '' : game_id,
    });
  };

  const { width: screenWidth } = Dimensions.get('window');
  const containerPadding = 15 * 2;
  const totalGapSpace = 8 * 2;
  const cardWidth = (screenWidth - containerPadding - totalGapSpace) / 2;

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
      <Content
        title={t('content-title.live-sports').toUpperCase()}
        icon={<SportsSvg />}
      >
        <View style={styles.sportsMenu}>
          {getSportsMenu(t).map((sports, index) => (
            <ButtonOption
              key={index}
              title={sports.title}
              icon={sports.icon}
              onClick={() => handleGameSelection(sports.id)}
              isActive={activeSports === sports.id}
            />
          ))}
        </View>
      </Content>
      {filteredGameList.length <= 0 ? (
        <View style={styles.noGamesContainer}>
          <Text category="p1">
            {listLoading ? t('common-terms.loading') : 'No games found'}
          </Text>
        </View>
      ) : (
        <View style={styles.mobileGrid}>
          {filteredGameList.map((sports, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleGameClick(sports)}
            >
              <View style={{ width: cardWidth }}>
                <Image
                  source={{ uri: imageHandler(sports.img_lnk) }}
                  style={styles.gameImage}
                  resizeMode="stretch"
                />
                {sports.game_id === loading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.loadingText}>{t('common-terms.please-wait')}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.gameName}>{sports.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    padding: 15,
  },
  mobileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gameImage: {
    borderRadius: 8,
    width: '100%',
    minHeight: 120,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  redirectContainer: {
    flex: 1,
    width: '100%',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  redirectText: {
    fontFamily: 'var(--font-montserrat)',
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  waitContainer: {
    flex: 1,
    width: '100%',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  largeLoadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderTopColor: 'transparent',
  },
  waitText: {
    fontFamily: 'var(--font-montserrat)',
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  iframeContainer: {
    flex: 1,
    width: '100%',
    minHeight: 954,
    paddingBottom: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e2e2e',
  },
  iframeText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  sportsMenu: {
    flexDirection: 'row',
    gap: 8,
  },
  sportsIcon: {
    width: 24,
    height: 24,
  },
  noGamesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
});
