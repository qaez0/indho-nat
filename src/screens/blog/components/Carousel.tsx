import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import type { IBlog } from '../../../types/blogs';
import { useSharedValue } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { BlogNav } from '../../../types/nav';
import { useNavigation } from '@react-navigation/native';

export default function BlogCarousel({ blogs }: { blogs: IBlog[] }) {
  const navigation = useNavigation<BlogNav>();
  const { width: screenWidth } = Dimensions.get('window');
  const progress = useSharedValue<number>(0);
  const ref = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePress = (item: IBlog) => {
    navigation.navigate('specific-blog', {
      articleId: item.id.toString(),
    });
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const renderItem = ({ item }: { item: IBlog; index: number }) => (
    <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.9}>
      <View
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: item?.image }}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover"
        />
        <LinearGradient
          locations={[0, 0.5, 1]}
          colors={['transparent', '#00000020', '#000000']}
          style={[StyleSheet.absoluteFillObject]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        loop
        width={screenWidth - 30}
        height={170}
        data={blogs || []}
        scrollAnimationDuration={1000}
        onProgressChange={progress}
        onSnapToItem={index => setCurrentIndex(index)}
        renderItem={renderItem}
        autoPlay={true}
        autoPlayInterval={2000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 50,
          parallaxAdjacentItemScale: 0.8,
        }}
      />

      <View style={styles.controls}>
        <View style={styles.textContent}>
          <Text style={styles.slideTitle} category="p1">
            {blogs[currentIndex]?.title}
          </Text>
          <Text style={styles.slideDate} category="c1">
            {new Date(
              blogs[currentIndex]?.updated_at || new Date(),
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <Pagination.Custom
          data={blogs}
          progress={progress}
          dotStyle={{
            width: 24,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#FFFFFF20',
          }}
          activeDotStyle={{
            backgroundColor: '#FFFFFF',
          }}
          containerStyle={{ gap: 5, alignSelf: 'flex-end' }}
          onPress={onPressPagination}
          horizontal
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 170,
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    bottom: 16,
    left: 10,
    right: 10,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
    zIndex: 20,
  },
  textContent: {
    flex: 1,
    marginRight: 16,
  },
  slideTitle: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  slideDate: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF60',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: 24,
    height: 6,
    borderRadius: 20,
    marginRight: 5,
    backgroundColor: '#FFFFFF20',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
});
