import { View, StyleSheet, Dimensions } from 'react-native';
import GameCard from '../GameCard';
import { Text } from '@ui-kitten/components';
import CustomPagination from '../Pagination';
import { ISlot } from '../../types/slot';
import Skeleton from '../Skeleton';

interface IGameRes {
  data: ISlot[];
  currentPage: number;
  totalPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  isLoading: boolean;
}

const GameResult = ({
  data,
  totalPage,
  currentPage,
  setPage,
  isLoading,
  pageSize,
}: IGameRes) => {
  const { width: screenWidth } = Dimensions.get('window');
  const containerPadding = 15 * 2;
  const gap = 8;
  const minCardsPerRow = 3;
  const minCardSize = 100;
  const maxCardSize = 121;

  // Calculate available width (screen width minus padding and gaps)
  const availableWidth = screenWidth - containerPadding;
  
  // Calculate card size for minimum 3 cards per row
  // Formula: (availableWidth - (gap * (minCardsPerRow - 1))) / minCardsPerRow
  const calculatedCardSize = (availableWidth - gap * (minCardsPerRow - 1)) / minCardsPerRow;
  
  // Clamp card size between min and max
  const cardSize = Math.max(
    minCardSize,
    Math.min(maxCardSize, Math.floor(calculatedCardSize))
  );
  
  const cardWidth = cardSize;
  const cardHeight = cardSize;

  const SkeletonPlaceholderUI = () => {
    if (isLoading) {
      return (
        <View style={styles.container}>
          <View style={[styles.gridContainer]}>
            {Array.from({ length: 21 }).map((_, index) => (
              <Skeleton key={index} width={cardWidth} height={cardHeight} />
            ))}
          </View>
        </View>
      );
    }
    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text category="p1">No games found</Text>
        </View>
      );
    }
    return null;
  };
  return (
    <View style={{ flex: 1 }} key={`pagination-${totalPage}-${currentPage}`}>
      {data.length === 0 ? (
        <SkeletonPlaceholderUI />
      ) : (
        <View style={styles.container}>
          <View style={[styles.gridContainer]}>
            {data.map((game, index) => (
              <GameCard
                key={index}
                {...game}
                customWidth={cardWidth}
                customHeight={cardHeight}
              />
            ))}
          </View>
          {totalPage > 21 && (
            <CustomPagination
              totalItems={totalPage}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setPage}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default GameResult;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 15,
  },
  emptyContainer: {
    minHeight: 100,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
