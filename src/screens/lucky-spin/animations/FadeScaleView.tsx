import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

interface FadeScaleViewProps {
  children: React.ReactNode;
  durationMs?: number;
  delayMs?: number;
  style?: ViewStyle | ViewStyle[];
}

const FadeScaleView: React.FC<FadeScaleViewProps> = ({
  children,
  durationMs = 500,
  delayMs = 0,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durationMs,
        delay: delayMs,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: durationMs,
        delay: delayMs,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => {
      animation.stop();
    };
  }, [delayMs, durationMs, opacity, scale]);

  return (
    <Animated.View style={[{ opacity, transform: [{ scale }] }, style, {
      flex: 1,
    }]}>
      {children}
    </Animated.View>
  );
};

export default FadeScaleView;

