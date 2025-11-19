import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import Carousel from './components/Carousel';
import ArticleCard from './components/ArticleCard';
import type { IBlog } from '../../types/blogs';
import { useTranslation } from 'react-i18next';
import Content from '../../components/Content';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '../../services/blog.service';
import { BLOG_CATEGORIES } from '../../constants/blogs';
import { BlogNav } from '../../types/nav';
import { useNavigation } from '@react-navigation/native';

const BlogScreen = () => {
  const navigation = useNavigation<BlogNav>();

  const { data } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => getBlogs(),
  });

  const latestBlogs = data?.data
    .sort(
      (a: IBlog, b: IBlog) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 6);

  const categorizedBlogs = BLOG_CATEGORIES.reduce(
    (acc: Record<string, IBlog[]>, category: string) => {
      const filteredBlogs = data?.data
        .filter((blog: IBlog) => blog.category === category)
        .sort(
          (a: IBlog, b: IBlog) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        );
      acc[category] = filteredBlogs?.slice(0, 4) || [];
      return acc;
    },
    {} as Record<string, IBlog[]>,
  );

  const handleViewAll = (category: string) => {
    navigation.navigate('overview-blogs', { category });
  };

  const { width: screenWidth } = Dimensions.get('window');
  const containerPadding = 15 * 2;
  const totalGapSpace = 8;
  const cardWidth = (screenWidth - containerPadding - totalGapSpace) / 2;
  const cardHeight = cardWidth * 0.8;

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Carousel blogs={latestBlogs || []} />
      {Object.entries(categorizedBlogs).map(([category, categoryBlogs]) => (
        <Content
          key={category}
          title={category}
          more={
            <Button
              style={style.viewAllButton}
              onPress={() => handleViewAll(category)}
            >
              {(evaProps: any) => (
                <Text {...evaProps} style={style.viewAllButtonText}>
                  View All
                </Text>
              )}
            </Button>
          }
        >
          <View style={style.blogGrid}>
            {categoryBlogs.map((blog: IBlog) => (
              <ArticleCard
                key={blog.id}
                {...blog}
                styles={{ width: cardWidth, height: cardHeight }}
              />
            ))}
          </View>
        </Content>
      ))}
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 15,
    padding: 15,
  },
  blogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  bonusSection: {
    flexDirection: 'column',
    gap: 8,
  },
  bonusIcon: {
    width: 24,
    height: 24,
  },
  placeholderIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  placeholderBonus: {
    height: 100,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default BlogScreen;
