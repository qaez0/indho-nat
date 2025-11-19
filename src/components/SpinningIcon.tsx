import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Animated } from 'react-native';

interface SpinningIconProps {
  children: React.ReactNode;
  isLoading?: boolean;
  duration?: number;
}

const SpinningIcon: React.FC<SpinningIconProps> = ({ 
  children, 
  isLoading = false, 
  duration = 1000 
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    animationRef.current = Animated.loop(
      Animated.timing(spinAnim, { 
        toValue: 1, 
        duration, 
        useNativeDriver: true 
      })
    );
    animationRef.current.start();
  }, [spinAnim, duration]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    spinAnim.setValue(0);
  }, [spinAnim]);

  useEffect(() => {
    if (isLoading) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isLoading, startAnimation, stopAnimation]);

  const spin = useMemo(() => 
    spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    }), [spinAnim]
  );

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      {children}
    </Animated.View>
  );
};

export default SpinningIcon; 