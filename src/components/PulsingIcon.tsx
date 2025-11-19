import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, View } from 'react-native';

interface PulsingIconProps {
  source: ImageSourcePropType;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const PulsingIcon: React.FC<PulsingIconProps> = ({ 
  source, 
  style, 
  resizeMode = 'contain' 
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        // Scale up + glow intensifies
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
        // Scale down + glow fades
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseAnim, glowAnim]);

  return (
    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      {/* Multi-layered transparent glow effect */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: '#FFFF00',
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.05],
            }),
            transform: [{ scale: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1.2],
            })}],
            zIndex: -3,
          }
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: '#FFFF00',
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.08],
            }),
            transform: [{ scale: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1.15],
            })}],
            zIndex: -2,
          }
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#FFFF00',
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.12],
            }),
            transform: [{ scale: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1.1],
            })}],
            zIndex: -1,
          }
        ]}
      />
      
      {/* Main Icon */}
      <Animated.View 
        style={[
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Image 
          source={source} 
          style={style} 
          resizeMode={resizeMode}
        />
      </Animated.View>
    </View>
  );
};

export default PulsingIcon;
