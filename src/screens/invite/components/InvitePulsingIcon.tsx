import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, View } from 'react-native';

interface InvitePulsingIconProps {
  source: ImageSourcePropType;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const InvitePulsingIcon: React.FC<InvitePulsingIconProps> = ({ 
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
      {/* Main Icon with pulse effect only (no glow) */}
      <Animated.View 
        style={[
          { transform: [{ scale: pulseAnim }] }
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

export default InvitePulsingIcon;
