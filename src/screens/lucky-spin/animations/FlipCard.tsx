import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface FlipCardProps {
  isFlipped: boolean;
  width?: number | string;
  height?: number | string;
  front: React.ReactNode;
  back: React.ReactNode;
  durationMs?: number;
}

const FlipCard: React.FC<FlipCardProps> = ({
  isFlipped,
  width = '100%',
  height = 130,
  front,
  back,
  durationMs = 200,
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  const frontInterpolate = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isFlipped ? 180 : 0,
      duration: durationMs,
      useNativeDriver: true,
    }).start();
  }, [durationMs, isFlipped, rotation]);

  return (
    <View
      style={{
        width: width as number,
        height: height as number,
      }}
    >
      <Animated.View
        style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}
      >
        {front}
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          { transform: [{ rotateY: backInterpolate }] },
        ]}
      >
        {back}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
});

export default FlipCard;
