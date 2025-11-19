import { StyleSheet, ScrollView } from 'react-native';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSlots } from '../../hooks/useSlots';
import RecommendedGames from '../../components/game/RecommendedGames';
import { ISlot } from '../../types/slot';
import GameFilter from '../../components/game/GameFilter';
import GameResult from '../../components/game/GameResult';
import { getSlotProviderOptions } from '../../constants/slots';
import React from 'react';
import {
  useFocusEffect,
  useRoute,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { TabsParamList } from '../../types/nav';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const SlotsView = () => {
  const { t } = useTranslation();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const route = useRoute<RouteProp<TabsParamList, 'slots'>>();
  const navigation =
    useNavigation<BottomTabNavigationProp<TabsParamList, 'slots'>>();
  const gameIdFromParams = route.params?.game_id;
  const gameIdMostPlayedRules = ['cq9', 'JILI', 'SPRIBE', 'PG'];
  const {
    data: recomendedGames,
    isLoading: isLoadingRecomendedGames,
    isFetching: isFetchingRecomendedGames,
    isRefetching: isRefetchingRecomendedGames,
  } = useSlots({
    name: '',
    category: 'MOST PLAYED',
    game_id: '',
    page: 1,
    pagesize: 20,
  });

  const initialFilterState = {
    name: '',
    category: 'SLOTS',
    game_id: gameIdFromParams || '',
    page: 1,
    pagesize: 21,
  };

  const {
    data: slotGames,
    dispatch,
    state,
    isLoading,
    isFetching,
    isRefetching,
  } = useSlots(initialFilterState);

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });

      // Use a small delay to ensure navigation state is updated after navigation
      // This handles cases where React Navigation hasn't updated params yet
      const timeoutId = setTimeout(() => {
        // Read params from navigation state directly to get the most up-to-date values
        // This bypasses any potential caching issues with route.params
        const navState = navigation.getState();
        let currentGameIdFromParams: string | undefined = undefined;

        // Navigate through the navigation state to find the slots route params
        try {
          const mainTabsRoute = navState?.routes?.find(
            (r: any) => r.name === 'main-tabs',
          );
          if (mainTabsRoute?.state) {
            const drawerState = mainTabsRoute.state as any;
            const tabsRoute = drawerState.routes?.find(
              (r: any) => r.name === 'tabs',
            );
            if (tabsRoute?.state) {
              const tabsState = tabsRoute.state as any;
              const slotsRoute = tabsState.routes?.find(
                (r: any) => r.name === 'slots',
              );
              if (slotsRoute?.params) {
                currentGameIdFromParams = slotsRoute.params.game_id;
              }
            }
          }
        } catch (e) {
          // Fallback to route.params if navigation state access fails
          currentGameIdFromParams = route.params?.game_id;
        }

        // Also check route.params as a fallback (use the one that's defined)
        if (currentGameIdFromParams === undefined) {
          currentGameIdFromParams = route.params?.game_id;
        }

        // Always apply params when screen comes into focus to ensure consistency
        // This ensures that every navigation from minigames will set SPRIBE tab
        // We always apply regardless of current state to handle React Navigation param merging
        if (
          currentGameIdFromParams !== undefined &&
          currentGameIdFromParams !== ''
        ) {
          // If params specify a game_id, always set it (even if already set)
          dispatch({ type: 'SET_GAME_ID', payload: currentGameIdFromParams });
        } else {
          // If game_id is undefined or empty, reset to 'all' tab
          dispatch({ type: 'SET_GAME_ID', payload: '' });
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }, [navigation, route.params?.game_id, dispatch]),
  );

  const mostPlayedGames = useMemo(
    () =>
      recomendedGames?.data?.data?.filter((game: ISlot) =>
        gameIdMostPlayedRules.includes(game.game_id),
      ),
    [recomendedGames],
  );

  const filteredSlotGames =
    slotGames?.data?.data?.filter((game: ISlot) => game.game_id !== 'PG') || []; // end of hide pg games

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
      <RecommendedGames
        game={(mostPlayedGames || []) as ISlot[]}
        loading={
          isLoadingRecomendedGames ||
          isFetchingRecomendedGames ||
          isRefetchingRecomendedGames
        }
      />
      <GameFilter
        dispatch={dispatch}
        state={state}
        options={getSlotProviderOptions(t)}
        isLoading={isLoading || isFetching || isRefetching}
        initialFilterState={initialFilterState}
      />
      <GameResult
        data={slotGames?.data?.data as ISlot[]}
        totalPage={slotGames?.data?.totalItems || 0}
        currentPage={slotGames?.data?.currentPage || 0}
        pageSize={slotGames?.data?.pageSize || 0}
        setPage={page => dispatch({ type: 'SET_PAGE', payload: page })}
        isLoading={isLoading || isFetching || isRefetching}
      />
    </ScrollView>
  );
};
export default SlotsView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    padding: 15,
  },
});
