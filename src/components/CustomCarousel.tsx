import { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { ICarousel } from '../types/ui';
import { useNavigation } from '@react-navigation/native';
import { RootStackNav, TabNav } from '../types/nav';

interface CustomCarouselProps {
  bannerData: ICarousel[];
  customCarouselHeight?: number;
}

const CustomCarousel = ({
  bannerData,
  customCarouselHeight,
}: CustomCarouselProps) => {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { width: screenWidth } = Dimensions.get('window');
  const navigation = useNavigation<RootStackNav>();
  const carouselWidth = screenWidth - 30;
  const carouselHeight = customCarouselHeight ?? 170;

  const handleBannerPress = (item: ICarousel) => {
    if (item.nav.startsWith('http')) {
      Linking.openURL(item.nav).catch(err =>
        console.error('Failed to open URL:', err),
      );
      return;
    }

    switch (item.nav) {
      case 'promotions':
        navigation.navigate('main-tabs', {
          screen: 'tabs',
          params: {
            screen: 'promotions',
          },
        });
        break;
      case 'earn':
        navigation.navigate('main-tabs', {
          screen: 'tabs',
          params: {
            screen: 'earn',
          },
        });
        break;
      case 'vip':
        navigation.navigate('vip');
        break;
      case 'affiliate':
        navigation.navigate('main-tabs', {
          screen: 'tabs',
          params: {
            screen: 'affiliate',
          },
        });
        break;
      default:
        console.warn('Unknown navigation route:', item.nav);
        break;
    }
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const renderItem = ({ item }: { item: ICarousel; index: number }) => (
    <TouchableOpacity
      onPress={() => handleBannerPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
        }}
        resizeMode="stretch"
        onError={error => console.log('Image loading error for item', item.id, ':', error)}
        onLoad={() => console.log('Image loaded successfully for item', item.id)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        loop
        width={carouselWidth}
        height={carouselHeight}
        data={bannerData || []}
        scrollAnimationDuration={1000}
        onProgressChange={progress}
        renderItem={renderItem}
        autoPlay={true}
        autoPlayInterval={2000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 30,
          parallaxAdjacentItemScale: 0.8,
        }}
      />

      <Pagination.Custom
        data={bannerData}
        progress={progress}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
        }}
        activeDotStyle={{
          backgroundColor: '#F3B867',
          width: 24,
        }}
        containerStyle={{ gap: 5 }}
        onPress={onPressPagination}
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
});

export default CustomCarousel;
