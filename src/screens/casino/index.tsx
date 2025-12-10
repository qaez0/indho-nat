import { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import Content from '../../components/Content';
import ButtonOption from '../../components/game/ButtonOption';
import { LiveCasino } from '../../types/casino';
import { useCasino } from '../../hooks/useCasino';
import SwiperLeftOrRight from '../../components/game/SwiperLeftOrRight';
import GameCard from '../../components/GameCard';
import { ISlot } from '../../types/slot';
import CasinoSvg from '../../assets/common/content-icons/casino.svg';
import Skeleton from '../../components/Skeleton';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentRoute } from '../../store/useUIStore';
import React from 'react';
import { useUser } from '../../hooks/useUser';

export default function LiveCasinoPage() {
  const {
    categorizedGames,
    providers,
    selectedProvider,
    setSelectedProvider,
    isLoading,
  } = useCasino();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { t } = useTranslation();
  const currentRoute = useCurrentRoute(state => state.currentRoute);
  const { width: screenWidth } = Dimensions.get('window');
  const scrollContainerRefs = useRef<{ [key: string]: ScrollView | null }>({});
  const isEmpty = Object.values(categorizedGames).every(
    ({ games }) => games.length === 0,
  );
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (selectedProvider !== 'all') {
          setSelectedProvider('all');
        }
      };
    }, [currentRoute]),
  );

  const MockDataForSkeleton = [10, 12, 15];
  const handleScroll = (categoryKey: string, direction: 'left' | 'right') => {
    const scrollContainer = scrollContainerRefs.current[categoryKey];
    if (scrollContainer) {
      scrollContainer.scrollTo({
        x: direction === 'left' ? -screenWidth : screenWidth,
        animated: true,
      });
    }
  };

  const SkeletonPlaceholderUI = () => {
    if (isLoading || isEmpty) {
      return (
        <>
          {MockDataForSkeleton.map((item, index) => (
            <Content
              icon={<Skeleton width={20} height={20} borderRadius={50} />}
              title={<Skeleton width={100} height={20} />}
              key={index}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.gamesScrollContainer}
                contentContainerStyle={styles.gamesScrollContent}
              >
                {Array.from({ length: item }).map((_, index) => (
                  <Skeleton key={index} width={109} height={109} borderRadius={6} />
                ))}
              </ScrollView>
            </Content>
          ))}
        </>
      );
    }
    return null;
  };

  const isCasinoCategory = (category: string) => {
    if (!category) return false;
    try {
      const parsed = JSON.parse(category);
      if (Array.isArray(parsed)) {
        return parsed.some(
          (item: string) => item?.toUpperCase?.() === 'CASINO',
        );
      }
    } catch {
      // fallback to substring check
    }
    return category.toUpperCase().includes('CASINO');
  };

  const recentlyPlayedCasino = useMemo(() => {
    if (!isAuthenticated) return [];
    const games = user?.player_info?.recently_played_games || [];
    return games.filter(game => isCasinoCategory(game.category));
  }, [isAuthenticated, user?.player_info?.recently_played_games]);

  const showRecentlyPlayed =
    !userLoading.panelInfo && recentlyPlayedCasino.length > 0;

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
      {showRecentlyPlayed && (
        <Content
          title={t('content-title.recently-played').toUpperCase()}
          icon={<CasinoSvg />}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.gamesScrollContainer}
            contentContainerStyle={styles.gamesScrollContent}
            removeClippedSubviews 
          >
            {recentlyPlayedCasino.map((game: ISlot) => (
              <GameCard
                key={game.url}
                {...game}
                customWidth={109}
                customHeight={109}
              />
            ))}
          </ScrollView>
        </Content>
      )}

      <Content
        title={t('content-title.live-casino').toUpperCase()}
        icon={<CasinoSvg />}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.providerContainer}
        >
          {providers.map(choice => (
            <ButtonOption
              key={choice.id}
              title={choice.title}
              icon={choice.image}
              onClick={() => setSelectedProvider(choice.id as LiveCasino)}
              isActive={selectedProvider === choice.id}
            />
          ))}
        </ScrollView>
      </Content>

      {isEmpty ? (
        <SkeletonPlaceholderUI />
      ) : (
        <View style={styles.gamesContainer}>
          {Object.entries(categorizedGames).map(
            ([categoryKey, { games, title }], categoryIndex) => {
              return (
                games.length > 0 && (
                  <Content
                    title={title}
                    key={title + categoryIndex}
                    more={
                      games.length > 3 && (
                        <SwiperLeftOrRight
                          onClickLeft={() => handleScroll(categoryKey, 'left')}
                          onClickRight={() =>
                            handleScroll(categoryKey, 'right')
                          }
                        />
                      )
                    }
                    icon={<CasinoSvg />}
                  >
                    <ScrollView
                      ref={(el: ScrollView | null) => {
                        scrollContainerRefs.current[categoryKey] = el;
                      }}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.gamesScrollContainer}
                      contentContainerStyle={styles.gamesScrollContent}
                      removeClippedSubviews 
                    >
                      {games.map((game: ISlot) => (
                        <GameCard key={game.url} {...game} customWidth={109} customHeight={109} />
                      ))}
                    </ScrollView>
                  </Content>
                )
              );
            },
          )}
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
  providerContainer: {
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    display: 'flex',
  },
  loadingContainer: {
    minHeight: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
  },
  emptyContainer: {
    flexDirection: 'row',
    minHeight: 140,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
  },
  gamesContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  gamesScrollContainer: {
    flexDirection: 'row',
  },
  gamesScrollContent: {
    gap: 8,
    paddingHorizontal: 0,
  },
});
