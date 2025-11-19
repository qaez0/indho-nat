import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import GameCard from '../../../components/GameCard';
import { ISlot } from '../../../types/slot';
import Skeleton from '../../../components/Skeleton';
import { useAutoSwipe } from '../../../hooks/useAutoSwipe';

interface Props {
  games: ISlot[];
  isLoading?: boolean;
  rows?: number;
  disableAutoSwipe?: boolean;
}

const GamePreview = React.memo(({ games, isLoading, rows, disableAutoSwipe = false }: Props) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  
  const autoSwipe = useAutoSwipe({
    itemWidth: 109,
    itemGap: 8,
    totalItems: games.length,
    autoSwipeInterval: 3000,
  });

  // Stop auto swipe immediately if disabled
  React.useEffect(() => {
    if (disableAutoSwipe) {
      autoSwipe.stopAutoSwipe();
    } else {
      autoSwipe.startAutoSwipe();
    }
  }, [disableAutoSwipe, autoSwipe]);

  // Use auto swipe handlers only if not disabled
  const handleScroll = disableAutoSwipe ? () => {} : autoSwipe.handleScroll;
  const handleManualScrollEnd = disableAutoSwipe ? () => {} : autoSwipe.handleManualScrollEnd;
  const pauseAutoSwipe = disableAutoSwipe ? () => {} : autoSwipe.pauseAutoSwipe;
  const resumeAutoSwipe = disableAutoSwipe ? () => {} : autoSwipe.resumeAutoSwipe;
  
  // Use the ref from auto swipe if enabled, otherwise use local ref
  const activeScrollViewRef = disableAutoSwipe ? scrollViewRef : autoSwipe.scrollViewRef;

  // Calculate items per row for grid layout
  const { width: screenWidth } = Dimensions.get('window');
  const containerPadding = 15 * 2;
  const cardWidth = 109;
  const gap = 8;
  const itemsPerRow = Math.floor((screenWidth - containerPadding) / (cardWidth + gap));
  
  // Create refs for each row's ScrollView
  const rowScrollRefs = useRef<{ [key: number]: ScrollView | null }>({});
  
  // Group games into rows for grid layout
  const groupGamesIntoRows = (gamesList: ISlot[], numRows: number) => {
    const rows: ISlot[][] = [];
    for (let i = 0; i < numRows; i++) {
      rows.push([]);
    }
    gamesList.forEach((game, index) => {
      const rowIndex = index % numRows;
      rows[rowIndex].push(game);
    });
    return rows;
  };

  const renderGridContent = () => {
    if (games.length > 0 && !isLoading && rows) {
      const gameRows = groupGamesIntoRows(games, rows);
      
      return (
        <View style={styles.gridWrapper}>
          {gameRows.map((row, rowIndex) => {
            const rowWidth = row.length * (cardWidth + gap) - gap;
            return (
              <ScrollView
                key={`row-${rowIndex}`}
                ref={(ref) => {
                  rowScrollRefs.current[rowIndex] = ref;
                }}
                horizontal
                style={styles.rowScrollView}
                contentContainerStyle={[
                  styles.gridRow,
                  { width: Math.max(rowWidth, screenWidth - containerPadding) },
                ]}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
              >
                {row.map((game, gameIndex) => (
                  <GameCard
                    key={`${rowIndex}-${gameIndex}`}
                    {...game}
                    customWidth={109}
                    customHeight={109}
                  />
                ))}
              </ScrollView>
            );
          })}
        </View>
      );
    }
    
    // Skeleton loading
    if (rows) {
      // Generate enough skeleton items per row to ensure horizontal scrolling
      const skeletonItemsPerRow = Math.max(itemsPerRow + 4, 8);
      return (
        <View style={styles.gridWrapper}>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <ScrollView
              key={`skeleton-row-${rowIndex}`}
              horizontal
              style={styles.rowScrollView}
              contentContainerStyle={styles.gridRow}
              showsHorizontalScrollIndicator={false}
            >
              {Array.from({ length: skeletonItemsPerRow }, (_, index) => (
                <Skeleton
                  key={`skeleton-${rowIndex}-${index}`}
                  width={109}
                  height={109}
                  borderRadius={6}
                />
              ))}
            </ScrollView>
          ))}
        </View>
      );
    }
    
    return null;
  };

  const renderContent = () => {
    if (games.length > 0 && !isLoading) {
      return games.map((game, idx) => (
        <GameCard key={idx} {...game} customWidth={109} customHeight={109} />
      ));
    }
    // Generate enough skeleton items to ensure horizontal scrolling
    const skeletonCount = Math.max(12, Math.ceil((screenWidth / (cardWidth + gap)) * 1.5));
    return Array.from({ length: skeletonCount }, (_, index) => (
      <Skeleton
        key={`skeleton-${index}`}
        width={109}
        height={109}
        borderRadius={6}
      />
    ));
  };

  // If rows is specified, use grid layout with independent row scrolling
  if (rows) {
    return (
      <View
        key={`game-preview-grid-${games.length}-${isLoading}`}
        style={[styles.gridScrollContainer, { height: rows * (109 + gap) - gap }]}
      >
        {renderGridContent()}
      </View>
    );
  }

  // Default horizontal scroll layout
  return (
    <ScrollView
      key={`game-preview-${games.length}-${isLoading}`}
      ref={activeScrollViewRef}
      horizontal
      style={styles.container}
      contentContainerStyle={styles.horizontalContent}
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      onScrollEndDrag={handleManualScrollEnd}
      onMomentumScrollEnd={handleManualScrollEnd}
      scrollEventThrottle={16}
      onTouchStart={pauseAutoSwipe}
      onTouchEnd={resumeAutoSwipe}
    >
      {renderContent()}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: { height: 109 },
  gridScrollContainer: {
    height: 109,
  },
  gridWrapper: {
    flexDirection: 'column',
    gap: 8,
  },
  rowScrollView: {
    height: 109,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  horizontalContent: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 15, // Add padding to ensure content extends beyond screen
  },
});

export default GamePreview;
