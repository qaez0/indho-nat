import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

interface FadeSlideInViewProps {
  children: React.ReactNode;
  durationMs?: number;
  delayMs?: number;
  translateYFrom?: number;
  style?: ViewStyle | ViewStyle[];
}

const FadeSlideInView: React.FC<FadeSlideInViewProps> = ({
  children,
  durationMs = 600,
  delayMs = 0,
  translateYFrom = 30,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(translateYFrom)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durationMs,
        delay: delayMs,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: durationMs,
        delay: delayMs,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => {
      animation.stop();
    };
  }, [delayMs, durationMs, translateY, opacity]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};

export default FadeSlideInView;

