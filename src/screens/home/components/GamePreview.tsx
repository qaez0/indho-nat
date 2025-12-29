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
  autoSwipeRowIndex?: number; // Enable autoscroll for a specific row (0-indexed)
}

// Separate component for a row with optional autoscroll
interface GameRowProps {
  row: ISlot[];
  rowIndex: number;
  rowWidth: number;
  screenWidth: number;
  containerPadding: number;
  shouldAutoSwipe: boolean;
}

const GameRow = React.memo(
  ({
    row,
    rowIndex,
    rowWidth,
    screenWidth,
    containerPadding,
    shouldAutoSwipe,
    cardWidth,
    cardHeight,
  }: GameRowProps & { cardWidth: number; cardHeight: number }) => {
    const rowAutoSwipe = useAutoSwipe({
      itemWidth: cardWidth,
      itemGap: 8,
      totalItems: row.length,
      autoSwipeInterval: 3000,
    });

    // Only start autoscroll if this row should have it
    React.useEffect(() => {
      if (shouldAutoSwipe) {
        rowAutoSwipe.startAutoSwipe();
      } else {
        rowAutoSwipe.stopAutoSwipe();
      }
      return () => {
        rowAutoSwipe.stopAutoSwipe();
      };
    }, [shouldAutoSwipe, rowAutoSwipe]);

    return (
      <ScrollView
        key={`row-${rowIndex}`}
        ref={rowAutoSwipe.scrollViewRef}
        horizontal
        style={[styles.rowScrollView, { height: cardHeight }]}
        contentContainerStyle={[
          styles.gridRow,
          { width: Math.max(rowWidth, screenWidth - containerPadding) },
        ]}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={shouldAutoSwipe ? rowAutoSwipe.handleScroll : undefined}
        onScrollEndDrag={
          shouldAutoSwipe ? rowAutoSwipe.handleManualScrollEnd : undefined
        }
        onMomentumScrollEnd={
          shouldAutoSwipe ? rowAutoSwipe.handleManualScrollEnd : undefined
        }
        onTouchStart={shouldAutoSwipe ? rowAutoSwipe.pauseAutoSwipe : undefined}
        onTouchEnd={shouldAutoSwipe ? rowAutoSwipe.resumeAutoSwipe : undefined}
        removeClippedSubviews
      >
        {row.map((game, gameIndex) => (
          <GameCard
            key={`${rowIndex}-${gameIndex}`}
            {...game}
            customWidth={cardWidth}
            customHeight={cardHeight}
          />
        ))}
      </ScrollView>
    );
  },
);

const GamePreview = React.memo(
  ({
    games,
    isLoading,
    rows,
    disableAutoSwipe = false,
    autoSwipeRowIndex,
  }: Props) => {
    const scrollViewRef = React.useRef<ScrollView>(null);

    // Calculate responsive card dimensions
    const { width: screenWidth } = Dimensions.get('window');
    const containerPadding = 15 * 2;
    const gap = 8;

    // On mobile, 3 cards fit fully within the screen (account for padding & gaps)
    // 80px ≈ side paddings + Swiper gaps; adjust if layout changes
    const isMobile = screenWidth < 600; // Adjust breakpoint as needed
    const cardWidth = isMobile ? Math.floor((screenWidth - 80) / 3) : 109;
    const cardHeight = cardWidth; // 1:1 aspect ratio

    const autoSwipe = useAutoSwipe({
      itemWidth: cardWidth,
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
    const handleManualScrollEnd = disableAutoSwipe
      ? () => {}
      : autoSwipe.handleManualScrollEnd;
    const pauseAutoSwipe = disableAutoSwipe
      ? () => {}
      : autoSwipe.pauseAutoSwipe;
    const resumeAutoSwipe = disableAutoSwipe
      ? () => {}
      : autoSwipe.resumeAutoSwipe;

    // Use the ref from auto swipe if enabled, otherwise use local ref
    const activeScrollViewRef = disableAutoSwipe
      ? scrollViewRef
      : autoSwipe.scrollViewRef;

    // Calculate items per row for grid layout
    const itemsPerRow = Math.floor(
      (screenWidth - containerPadding) / (cardWidth + gap),
    );

    // Games that should be in the third row
    const thirdRowAllowedGames = [
      'Fortune Rabbit',
      'Super Ace Deluxe',
      'Treasures of Aztec',
      'Money Coming',
      'Anubis Wrath',
      'Boxing King',
      'Fortune Ox',
      'Mines',
      'Fortune Tiger',
      'Crazy 777',
      'Legend of Perseus',
      'Money Pot',
      'Double Fortune',
      'Charge Buffalo',
      'Lucky Neko',
      'Fortune King Jackpot',
      'Wild Bandito',
      'Alibaba',
      'Pinata Wins',
      'Money Coming_ Expanded Bets',
      // EFG games added to the third row
      'Rise of Seth',
      'Rise of Thor',
      'Super Ace ULTIMATE',
      'Lucky Rabbit',
    ];

    // Group games into rows for grid layout
    // Note: gamesList already has fixed positions applied from useHome hook
    const groupGamesIntoRows = (gamesList: ISlot[], numRows: number) => {
      const rows: ISlot[][] = [];
      for (let i = 0; i < numRows; i++) {
        rows.push([]);
      }

      // Separate games that should be in the third row
      const thirdRowGames: ISlot[] = [];
      const otherGames: ISlot[] = [];

      gamesList.forEach(game => {
        const gameName = game.name?.trim();
        const isThirdRowGame = thirdRowAllowedGames.some(
          allowedName => gameName?.toLowerCase() === allowedName.toLowerCase(),
        );

        if (isThirdRowGame) {
          thirdRowGames.push(game);
        } else {
          otherGames.push(game);
        }
      });

      // If we have a third row (index 2), put thirdRowGames there
      if (numRows > 2) {
        rows[2] = thirdRowGames;
      }

      // Distribute remaining games to rows 1 and 2
      // Since gamesList already has fixed positions applied, we maintain the order
      // and distribute using modulo to preserve the fixed position arrangement
      const rowsToFill = numRows > 2 ? 2 : numRows;

      otherGames.forEach((game, index) => {
        const rowIndex = index % rowsToFill;
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
              const shouldAutoSwipe =
                autoSwipeRowIndex !== undefined &&
                rowIndex === autoSwipeRowIndex;

              return (
                <GameRow
                  key={`row-${rowIndex}`}
                  row={row}
                  rowIndex={rowIndex}
                  rowWidth={rowWidth}
                  screenWidth={screenWidth}
                  containerPadding={containerPadding}
                  shouldAutoSwipe={shouldAutoSwipe}
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                />
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
                style={[styles.rowScrollView, { height: cardHeight }]}
                contentContainerStyle={styles.gridRow}
                showsHorizontalScrollIndicator={false}
              >
                {Array.from({ length: skeletonItemsPerRow }, (_, index) => (
                  <Skeleton
                    key={`skeleton-${rowIndex}-${index}`}
                    width={cardWidth}
                    height={cardHeight}
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
          <GameCard
            key={idx}
            {...game}
            customWidth={cardWidth}
            customHeight={cardHeight}
          />
        ));
      }
      // Generate enough skeleton items to ensure horizontal scrolling
      const skeletonCount = Math.max(
        12,
        Math.ceil((screenWidth / (cardWidth + gap)) * 1.5),
      );
      return Array.from({ length: skeletonCount }, (_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          width={cardWidth}
          height={cardHeight}
          borderRadius={6}
        />
      ));
    };

    // If rows is specified, use grid layout with independent row scrolling
    if (rows) {
      return (
        <View
          key={`game-preview-grid-${games.length}-${isLoading}`}
          style={[
            styles.gridScrollContainer,
            { height: rows * (cardHeight + gap) - gap },
          ]}
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
        style={[styles.container, { height: cardHeight }]}
        contentContainerStyle={styles.horizontalContent}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollEndDrag={handleManualScrollEnd}
        onMomentumScrollEnd={handleManualScrollEnd}
        scrollEventThrottle={16}
        onTouchStart={pauseAutoSwipe}
        onTouchEnd={resumeAutoSwipe}
        removeClippedSubviews 
      >
        {renderContent()}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    // height will be set dynamically based on cardHeight
  },
  gridScrollContainer: {
    // height will be set dynamically based on cardHeight
  },
  gridWrapper: {
    flexDirection: 'column',
    gap: 8,
  },
  rowScrollView: {
    // height will be set dynamically based on cardHeight
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
