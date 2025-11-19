import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { IBlog } from '../../../types/blogs';
import { cleanHtml } from '../../../utils/removeHtmlTags';
import LinearGradient from 'react-native-linear-gradient';

interface BlogCardProps {
  blog: IBlog;
  onPress: (blog: IBlog) => void;
  gradientColors: string[];
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onPress, gradientColors }) => {
  return (
    <TouchableOpacity onPress={() => onPress(blog)}>
      <LinearGradient colors={gradientColors} style={styles.blogCard}>
        <Text style={styles.blogDate}>{blog.date_display}</Text>
        <Text style={styles.blogTitle} numberOfLines={2}>
          {blog.title}
        </Text>
        <Text style={styles.blogContent} numberOfLines={3}>
          {cleanHtml(blog.content)}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  blogCard: {
    width: 343,
    minHeight: 168,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    gap: 8,
  },
  blogDate: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '400',
  },
  blogTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  blogContent: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    opacity: 0.9,
  },
});

export default BlogCard;
