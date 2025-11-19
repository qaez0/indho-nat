import { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GameCard from '../GameCard';
import Content from '../Content';
import SwiperLeftOrRight from './SwiperLeftOrRight';
import { ISlot } from '../../types/slot';
import CasinoSvg from '../../assets/common/content-icons/casino.svg';
import Skeleton from '../Skeleton';

const RecommendedGames = ({
  game,
  loading,
}: {
  game: ISlot[];
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const { width: screenWidth } = Dimensions.get('window');
  const scrollContainerRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerPadding = 15 * 2;
  const cardWidth = 120;
  const cardHeight = 120;
  const scrollStep = cardWidth + 8;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef?.current) {
      let newPosition = scrollPosition;

      if (direction === 'left') {
        newPosition = Math.max(0, scrollPosition - scrollStep);
      } else {
        const maxScroll = Math.max(
          0,
          game.length * scrollStep - screenWidth + containerPadding,
        );
        newPosition = Math.min(maxScroll, scrollPosition + scrollStep);
      }

      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTo({
        x: newPosition,
        animated: true,
      });
    }
  };

  const SkeletonPlaceholderUI = () => {
    if (loading) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {Array.from({ length: 21 }).map((_, index) => (
            <Skeleton key={index} width={cardWidth} height={cardHeight} />
          ))}
        </ScrollView>
      );
    }
    if (game.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No games found</Text>
        </View>
      );
    }
    return null;
  };
  return (
    <Content
      title={t('content-title.most-played')}
      more={
        <SwiperLeftOrRight
          onClickLeft={() => handleScroll('left')}
          onClickRight={() => handleScroll('right')}
        />
      }
      icon={<CasinoSvg />}
    >
      {game.length === 0 ? (
        <SkeletonPlaceholderUI />
      ) : (
        <ScrollView
          ref={scrollContainerRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          onScroll={event => {
            setScrollPosition(event.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={16}
        >
          {game.map((game, index) => (
            <GameCard
              key={index}
              {...game}
              customWidth={cardWidth}
              customHeight={cardHeight}
            />
          ))}
        </ScrollView>
      )}
    </Content>
  );
};

export default RecommendedGames;

const styles = StyleSheet.create({
  loadingContainer: {
    minHeight: 140,
  },

  loadingText: {
    fontFamily: 'var(--font-montserrat)',
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 0,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
