import { StyleSheet, ScrollView } from 'react-native';
import { useMemo, useState, useEffect } from 'react';
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

// Define provider order based on tab arrangement (excluding "ALL")
// Use case-insensitive matching to handle variations like "cq9" vs "CQ9"
const PROVIDER_ORDER = ['JILI', 'PG', 'SPRIBE', 'CQ9'];
const PAGE_SIZE = 24;
const GAME_ID_MOST_PLAYED_RULES = ['cq9', 'JILI', 'SPRIBE'];

const SlotsView = () => {
  const { t } = useTranslation();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const route = useRoute<RouteProp<TabsParamList, 'slots'>>();
  const navigation =
    useNavigation<BottomTabNavigationProp<TabsParamList, 'slots'>>();
  const gameIdFromParams = route.params?.game_id;
  const [clientPage, setClientPage] = useState(1);

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
    pagesize: PAGE_SIZE,
  };

  const {
    data: slotGames,
    dispatch,
    state,
    isLoading,
    isFetching,
    isRefetching,
  } = useSlots(initialFilterState);

  // When showing ALL games (game_id is empty), fetch all games for client-side sorting
  // When a specific provider is selected, use server-side pagination
  const isShowingAll = !state.game_id || state.game_id === '';

  // Fetch all games when showing ALL for proper sorting
  const {
    data: allSlotGames,
    isLoading: isLoadingAllGames,
  } = useSlots({
    name: state.name || '',
    category: 'SLOTS',
    game_id: '',
    page: 1,
    pagesize: 1000, // Fetch all games when showing ALL
  });

  // Reset client page when filter changes
  useEffect(() => {
    setClientPage(1);
  }, [state.game_id, state.name]);

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });

      // Use a small delay to ensure navigation state is updated after navigation
      // This handles cases where React Navigation hasn't updated params yet
      const timeoutId = setTimeout(() => {
        // Read params from navigation state directly to get the most up-to-date values
        // This bypasses any potential caching issues with route.params
        const navState = navigation.getState();
        let currentGameIdFromParams: string | undefined;

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

  const mostPlayedGames = useMemo(() => {
    return recomendedGames?.data?.data?.filter((game: ISlot) =>
      GAME_ID_MOST_PLAYED_RULES.includes(game.game_id),
    );
  }, [recomendedGames]);

  // Sort games by provider order (only when showing ALL)
  const sortedSlotGames = useMemo(() => {
    if (!isShowingAll) {
      // When a specific provider is selected, return games as-is (server-side pagination)
      const games = slotGames?.data?.data || [];
      // Filter out EFG games
      return games.filter((game: ISlot) => game.game_id !== 'EFG');
    }

    // When showing ALL, use allSlotGames and sort by provider order
    const games = allSlotGames?.data?.data || [];
    // Filter out EFG games first
    const filteredGames = games.filter((game: ISlot) => game.game_id !== 'EFG');
    
    return [...filteredGames].sort((a: ISlot, b: ISlot) => {
      // Normalize game_id to uppercase for case-insensitive comparison
      const gameIdA = (a.game_id || '').toUpperCase();
      const gameIdB = (b.game_id || '').toUpperCase();

      const indexA = PROVIDER_ORDER.findIndex(
        provider => provider.toUpperCase() === gameIdA,
      );
      const indexB = PROVIDER_ORDER.findIndex(
        provider => provider.toUpperCase() === gameIdB,
      );

      // If both are in the order list, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only A is in the list, A comes first
      if (indexA !== -1) return -1;
      // If only B is in the list, B comes first
      if (indexB !== -1) return 1;
      // If neither is in the list, maintain original order
      return 0;
    });
  }, [slotGames?.data?.data, allSlotGames?.data?.data, isShowingAll]);

  // Client-side pagination for ALL games, server-side for filtered games
  const paginatedGames = useMemo(() => {
    if (!isShowingAll) {
      // Server-side pagination - return games as-is
      return sortedSlotGames;
    }

    // Client-side pagination - slice the sorted games
    const startIndex = (clientPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return sortedSlotGames.slice(startIndex, endIndex);
  }, [sortedSlotGames, clientPage, isShowingAll]);

  // Calculate total items for pagination
  const totalItems = useMemo(() => {
    if (!isShowingAll) {
      return slotGames?.data?.totalItems || 0;
    }
    return sortedSlotGames.length;
  }, [isShowingAll, slotGames?.data?.totalItems, sortedSlotGames.length]);

  const handlePageChange = (page: number) => {
    if (isShowingAll) {
      setClientPage(page);
    } else {
      dispatch({ type: 'SET_PAGE', payload: page });
    }
  };

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
        data={paginatedGames as ISlot[]}
        totalItems={totalItems}
        currentPage={isShowingAll ? clientPage : (slotGames?.data?.currentPage || 1)}
        pageSize={PAGE_SIZE}
        setPage={handlePageChange}
        isLoading={isShowingAll ? isLoadingAllGames : (isLoading || isFetching || isRefetching)}
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
