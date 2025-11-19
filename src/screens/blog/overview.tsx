import { StyleSheet, Dimensions, ScrollView, View } from 'react-native';
import type { IBlog } from '../../types/blogs';
import ArticleCard from './components/ArticleCard';
import { BlogsParamList } from '../../types/nav';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getBlogs } from '../../services/blog.service';
import { useQuery } from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import lottieJson from '../../assets/loader.json';
import { useTopNavTitle } from '../../store/useUIStore';
import { useLayoutEffect } from 'react';

const BlogOverviewScreen = () => {
  const route = useRoute<RouteProp<BlogsParamList, 'overview-blogs'>>();
  const category = route.params?.category;
  const setTitle = useTopNavTitle(s => s.setTitle);

  useLayoutEffect(() => {
    setTitle(category);
    return () => {
      setTitle(undefined);
    };
  }, [category]);

  const { width: screenWidth } = Dimensions.get('window');
  const containerPadding = 15 * 2;
  const totalGapSpace = 8;
  const cardWidth = (screenWidth - containerPadding - totalGapSpace) / 2;
  const cardHeight = cardWidth * 0.8;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['blogs', category],
    queryFn: () => getBlogs(category),
  });

  const sortedBlogs: IBlog[] =
    data?.data?.sort(
      (a: IBlog, b: IBlog) =>
        new Date(b.date_display).getTime() - new Date(a.date_display).getTime(),
    ) || [];

  if (isLoading || isFetching) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView source={lottieJson} autoPlay loop style={styles.lottie} />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sortedBlogs.map((blog: IBlog) => (
        <ArticleCard
          key={blog.id}
          {...blog}
          styles={{ width: cardWidth, height: cardHeight }}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 15,
  },
  flexOne: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  lottie: {
    width: 100,
    aspectRatio: 1,
  },
});

export default BlogOverviewScreen;
