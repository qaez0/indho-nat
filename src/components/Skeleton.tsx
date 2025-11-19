import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SkeletonBoxProps {
  width?: number;
  height?: number;
  borderRadius?: number;
}

const Skeleton: React.FC<SkeletonBoxProps> = ({
  width = 100,
  height = 20,
  borderRadius = 8,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 2000,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startAnimation();
  }, [animatedValue]);

  // Shimmer translation with better range
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 1.5, width * 1.5],
  });

  // Opacity animation for smoother effect
  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.6, 0.2],
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <Animated.View
        style={[
          styles.shimmerContainer,
          {
            transform: [{ translateX }],
            opacity,
          },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.2)',
            'rgba(255,255,255,0.4)',
            'rgba(255,255,255,0.2)',
            'rgba(255,255,255,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.1)', // darker base for better contrast
    overflow: 'hidden',
  },
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    width: '70%', // wider shimmer for better effect
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
});

export default Skeleton;