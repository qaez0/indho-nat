import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface GlowProps {
  children: React.ReactNode;
  glowColor?: string;
  glowIntensity?: number;
}

const Glow: React.FC<GlowProps> = ({
  children,
  glowColor = '#FFFF00',
  glowIntensity = 0.12,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseSquareAnimation = Animated.loop(
      Animated.sequence([
        // 0% to 70% - expand and fade
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 700, // 70% of 2000ms
          useNativeDriver: false,
        }),
        // 70% to 100% - contract and fade out
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 200, // 30% of 2000ms
          useNativeDriver: false,
        }),
        // Reset to start
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );

    pulseSquareAnimation.start();

    return () => {
      pulseSquareAnimation.stop();
    };
  }, [glowAnim]);

  return (
    <View
      style={{
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
      }}
    >
      {/* Background glow effect - only behind the icon */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: glowAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [28, 36, 28], // Larger than icon to create ring effect
            }),
            height: glowAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [28, 36, 28], // Larger than icon to create ring effect
            }),
            borderRadius: glowAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [14, 18, 14], // Half of width/height for perfect circle
            }),
            backgroundColor: glowColor,
            opacity: glowAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0.2, 0.3, 0.2], // Subtle background glow
            }),
            top: glowAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [-2, -6, -2], // Center vertically (24/2 - size/2)
            }),
            left: glowAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [-2, -6, -2], // Center horizontally (24/2 - size/2)
            }),
            zIndex: 0, // Behind the icon
          },
        ]}
      />

      {/* The actual SVG/icon content */}
      <View style={{ 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 1, // Above the glow
        shadowColor: glowColor,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 8,
      }}>
        {children}
      </View>
    </View>
  );
};

export default Glow;
