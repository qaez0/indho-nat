import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BlogsParamList } from '../../types/nav';
import { useQuery } from '@tanstack/react-query';
import { getSpecificArticle } from '../../services/blog.service';
import RenderHTML from 'react-native-render-html';
import LottieView from 'lottie-react-native';
import lottieJson from '../../assets/loader.json';
import { useTopNavTitle } from '../../store/useUIStore';
import { useLayoutEffect } from 'react';

const SpecificBlogScreen = () => {
  const { width: screenWidth } = Dimensions.get('window');
  const route = useRoute<RouteProp<BlogsParamList, 'specific-blog'>>();
  const articleId = route.params?.articleId;
  const setTitle = useTopNavTitle(s => s.setTitle);
  4;

  useLayoutEffect(() => {
    setTitle('Article');
    return () => {
      setTitle(undefined);
    };
  }, []);

  const {
    data: article,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['specific-blog', articleId],
    queryFn: () => getSpecificArticle(Number(articleId)),
    enabled: !!articleId,
  });

  if (isLoading || isFetching) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView source={lottieJson} autoPlay loop style={styles.lottie} />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: article?.data?.image }}
        style={{
          width: screenWidth - 30,
          height: 170,
          borderRadius: 16,
        }}
        resizeMode="cover"
      />

      <View style={styles.articleHeader}>
        <Text style={styles.articleTitle}>{article?.data?.title}</Text>
        <Text style={styles.articleDate}>
          {new Date(
            article?.data?.date_display || new Date(),
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>
      <RenderHTML
        contentWidth={screenWidth}
        source={{ html: article?.data?.content || '' }}
        tagsStyles={{
          p: {
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 12,
            color: 'rgba(255, 255, 255, 0.5)',
          },
          h3: {
            fontSize: 18,
            fontWeight: 'bold',
            marginVertical: 8,
            color: 'rgba(255, 255, 255, 0.5)',
          },
          li: {
            fontSize: 16,
            lineHeight: 22,
            color: 'rgba(255, 255, 255, 0.5)',
          },
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 15,
    padding: 15,
  },

  articleHeader: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  articleTitle: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  articleDate: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF60',
  },
  articleContent: {
    marginBottom: 16,
  },
  contentText: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF80',
    lineHeight: 20,
  },
  contentSection: {
    marginBottom: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentTitle: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  viewAllButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  viewAllButtonText: {
    color: '#000',
    fontFamily: 'var(--font-roboto)',
    fontSize: 12,
    fontWeight: '700',
  },
  latestBlogsGrid: {
    width: '100%',
    flexDirection: 'row',
    gap: 16,
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

export default SpecificBlogScreen;
