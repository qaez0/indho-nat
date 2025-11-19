import { ScrollView, StyleSheet } from 'react-native';
import BlogCard from './BlogCard';
import { IBlog } from '../../../types/blogs';
import Skeleton from '../../../components/Skeleton';
import { useNavigation } from '@react-navigation/native';
import { RootStackNav } from '../../../types/nav';

interface Props {
  blogs: IBlog[];
  isLoading: boolean;
}

const BlogSection = ({ blogs, isLoading }: Props) => {
  const navigation = useNavigation<RootStackNav>();
  const handleBlogPress = (blog: IBlog) => {
    navigation.navigate('blog', {
      screen: 'specific-blog',
      params: {
        articleId: blog.id.toString(),
      },
    });
  };

  const getGradientStyle = (index: number) => {
    return index % 2 === 0 ? ['#2c1248', '#6d449c'] : ['#431a3f', '#9a2a9c'];
  };

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={`skeleton-${index}`}
              width={330}
              height={160}
              borderRadius={6}
            />
          ))
        : blogs.map((blog: IBlog, index: number) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onPress={handleBlogPress}
              gradientColors={getGradientStyle(index)}
            />
          ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 168,
  },
  contentContainer: {
    gap: 12,
    paddingRight: 16,
  },
  loadingContainer: {
    height: 168,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  loadingText: {
    color: '#FFFFFF80',
    fontSize: 14,
  },
  emptyContainer: {
    height: 168,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF80',
    fontSize: 14,
  },
});

export default BlogSection;
