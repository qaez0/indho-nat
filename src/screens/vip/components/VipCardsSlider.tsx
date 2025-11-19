import { useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { IVIPDetails } from '../../../types/vip';
import VipCard from './VipCard';
import VipProgressDots from './VipProgressDots';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';

export interface VipCardsSliderProps {
  levels: IVIPDetails[];
  setCurrentSlideIndex: (index: number) => void;
}

const VipCardsSlider = ({
  levels,
  setCurrentSlideIndex,
}: VipCardsSliderProps) => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { width: screenWidth } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  useAnimatedReaction(
    () => progress.value,
    currentProgress => {
      const newIndex = Math.round(currentProgress) % levels.length;
      runOnJS(setCurrentIndex)(newIndex);
      runOnJS(setCurrentSlideIndex)(newIndex);
    },
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return <VipCard index={index} level={item} isActive={true} />;
  };

  return (
    <View
      style={{
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <Carousel
        ref={carouselRef}
        loop={false}
        width={screenWidth}
        height={screenWidth * 0.58}
        data={levels}
        scrollAnimationDuration={1000}
        onProgressChange={progress}
        renderItem={renderItem}
        autoPlay={false}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.95,
          parallaxScrollingOffset: screenWidth * 0.16,
          parallaxAdjacentItemScale: 0.85,
        }}
      />

      <VipProgressDots
        totalDots={levels.length}
        currentIndex={currentIndex}
        onDotPress={onPressPagination}
      />
    </View>
  );
};

export default VipCardsSlider;
