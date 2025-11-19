import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Create animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface BlinkingCirclesProps {
  centerX: number;
  centerY: number;
  radius: number;
  circleRadius: number;
  circleSize: number;
  count?: number;
  staggerDelay?: number;
  animationDuration?: number;
  colors?: [string, string];
}

export default function BlinkingCircles({
  centerX,
  centerY,
  radius,
  circleRadius,
  circleSize,
  count = 24,
  staggerDelay = 0.1,
  animationDuration = 1000,
  colors = ['white', 'gray'],
}: BlinkingCirclesProps) {
  // Create animated values for blinking circles
  const blinkingAnimations = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  // Start blinking animations for circles
  useEffect(() => {
    const startBlinkingAnimations = () => {
      blinkingAnimations.forEach((animation, index) => {
        const delay = index * staggerDelay; // Stagger the animations
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animation, {
              toValue: 1,
              duration: animationDuration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(animation, {
              toValue: 0,
              duration: animationDuration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        ).start();
      });
    };

    startBlinkingAnimations();
  }, [blinkingAnimations, staggerDelay, animationDuration]);

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * (360 / count) - 90) * (Math.PI / 180);
        const x = centerX + circleRadius * Math.cos(angle);
        const y = centerY + circleRadius * Math.sin(angle);
        
        return (
          <AnimatedCircle
            key={i}
            cx={x}
            cy={y}
            r={circleSize}
            fill={blinkingAnimations[i].interpolate({
              inputRange: [0, 1],
              outputRange: colors,
            })}
          />
        );
      })}
    </>
  );
} 