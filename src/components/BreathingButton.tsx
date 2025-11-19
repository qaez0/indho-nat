import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface BreathingButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
}

export default function BreathingButton({
  onPress,
  disabled = false,
  isLoading = false,
  children,
  style,
  textStyle: _textStyle,
  loadingColor = '#fff',
}: BreathingButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (disabled || isLoading) {
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1);
      return;
    }

    // Create breathing animation
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    breathingAnimation.start();

    return () => {
      breathingAnimation.stop();
    };
  }, [disabled, isLoading, scaleAnim]);

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[style, { transform: [{ scale: scaleAnim }] }]}
    >
      {isLoading ? <ActivityIndicator color={loadingColor} /> : children}
    </AnimatedTouchableOpacity>
  );
}
