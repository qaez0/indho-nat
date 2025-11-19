import { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Easing,
  useWindowDimensions,
  Image,
} from 'react-native';
import BreathingButton from '../../../components/BreathingButton';
import Svg, {
  Circle,
  Path,
  Image as SvgImage,
  Text as SvgText,
  TSpan,
  G,
  
} from 'react-native-svg';
import { dummyData } from '../../../constants/wheel';
import BlinkingCircles from './BlinkingCircles';
import { RouletteData } from '../../../types/wheel';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

interface RouletteWheelProps {
  data: RouletteData[];
  onSpinComplete?: (result: RouletteData) => void;
  targetId?: number;
  isLoadingTarget?: boolean;
  onSpin?: () => void;
  isLoadingPrizes?: boolean;
}

export default function RouletteWheel({
  data,
  onSpinComplete,
  targetId,
  isLoadingTarget = false,
  onSpin,
  isLoadingPrizes = false,
}: RouletteWheelProps) {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const wheelSize = width * 0.75;

  const [isSpinning, setIsSpinning] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);

  const animatedRotation = useRef(new Animated.Value(0)).current;

  const defaultColors = ['#fee001', '#fea401', '#265408'];

  const displayData = useMemo(() => {
    return isLoadingPrizes ? dummyData : data;
  }, [isLoadingPrizes, data]);

  const segmentAngle = 360 / displayData.length;
  const radius = wheelSize / 2 - 20;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;

  const dataWithDegrees = useMemo(() => {
    return displayData.map((item, index) => ({
      ...item,
      degrees: index * segmentAngle + segmentAngle / 2,
    }));
  }, [displayData, segmentAngle]);

  const createSegmentPath = (index: number) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getPosition = (index: number, isImage = false) => {
    const angle =
      (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    const textRadius = isImage ? radius * 0.7 : radius * 0.45;
    const x = centerX + textRadius * Math.cos(angle);
    const y = centerY + textRadius * Math.sin(angle);
    return { x, y, angle: index * segmentAngle + segmentAngle / 2 };
  };

  useEffect(() => {
    if (targetId !== undefined && !isLoadingTarget && !isSpinning) {
      setIsSpinning(true);

      const targetItem = displayData.find(item => item.order === targetId);
      if (!targetItem) {
        setIsSpinning(false);
        return;
      }

      const targetDegrees = dataWithDegrees.find(
        item => item.order === targetId,
      )?.degrees;
      if (targetDegrees === undefined) {
        setIsSpinning(false);
        return;
      }

      const currentPosition = targetRotation % 360;
      const targetPosition = (360 - targetDegrees) % 360;
      const rotationNeeded = (targetPosition - currentPosition + 360) % 360;
      const extraSpins = Math.floor(Math.random() * 3) + 6;
      const totalRotation = targetRotation + extraSpins * 360 + rotationNeeded;

      setTargetRotation(totalRotation);

      Animated.timing(animatedRotation, {
        toValue: totalRotation,
        duration: 5000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          onSpinComplete?.(targetItem);
          setIsSpinning(false);
          // Don't reset rotation to keep wheel at winning position
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    targetId,
    isLoadingTarget,
    displayData,
    dataWithDegrees,
    targetRotation,
    isSpinning,
    onSpinComplete,
  ]);

  const handleSpin = () => {
    if (isSpinning || isLoadingTarget) return;
    onSpin?.();
  };

  const spinInterpolation = animatedRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
    
    <Image 
  source={require('../../../assets/wheel/pin.png')} 
  style={styles.pin}
/>
  
    <Svg width={wheelSize} height={wheelSize}>
        {/* Outer static circles */}
        <Circle cx={centerX} cy={centerY} r={radius + 20} fill="#F7B509" />
        <Circle cx={centerX} cy={centerY} r={radius + 15} fill="red" />
        {Array.from({ length: 24 }, (_, i) => (
          <BlinkingCircles
            key={i}
            centerX={centerX}
            centerY={centerY}
            radius={radius}
            circleRadius={radius + 8}
            circleSize={7}
            count={24}
            staggerDelay={1 + i}
            animationDuration={1000}
            colors={['white', 'gray']}
          />
        ))}

        {/* Animated spinning segments */}
        <Animated.View
          style={{
            position: 'absolute',
            width: wheelSize,
            height: wheelSize,
            transform: [{ rotate: spinInterpolation }],
          }}
        >
          <Svg width={wheelSize} height={wheelSize}>
            {displayData.map((item, index) => {
              const segmentColor = defaultColors[index % defaultColors.length];
              const textPos = getPosition(index);
              const imagePos = getPosition(index, true);

              return (
                <G key={item.id}>
                  <Path d={createSegmentPath(index)} fill={segmentColor} />

                  {/* Image facing outward */}
                  <G
                    transform={`translate(${imagePos.x}, ${imagePos.y}) rotate(${imagePos.angle})`}
                  >
                    <SvgImage
                      href={
                        typeof item.image === 'string'
                          ? { uri: item.image }
                          : item.image
                      }
                      x={-20}
                      y={-20}
                      width={40}
                      height={40}
                    />
                  </G>

                  {/* Text facing outward */}
                  <SvgText
                    x={textPos.x}
                    y={textPos.y}
                    fontSize={11}
                    fill="black"
                    fontWeight="bold" 
                    textAnchor="middle"
                    transform={`rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`}
                  >
                    {item.name.includes(' ')
                      ? item.name.split(' ').map((word, wordIndex) => (
                          <TSpan
                            key={wordIndex}
                            x={textPos.x}
                            dy={wordIndex === 0 ? 0 : 12}
                          >
                            {word}
                          </TSpan>
                        ))
                      : item.name}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </Animated.View>
      </Svg>

      {/* Spin button */}
      
      <BreathingButton
        onPress={handleSpin}
        disabled={isSpinning || isLoadingTarget}
        isLoading={isLoadingTarget}
        style={styles.spinButton}
        loadingColor="#fff"
      >

<LinearGradient
          colors={['#F3B867', '#ffeacc']} // Replace with your desired colors
          start={{ x: 0.5, y: 1 }}
          end={{ x: .05, y: 0 }}
          style={styles.gradientFill}
        >

        <View style={styles.spinButtonInner}>
  


          <Text style={styles.spinButtonText}>{t('wheel.roulette-wheel.spin')}</Text>
        
        </View>

        </LinearGradient>
      </BreathingButton>
    </View>
  );
}

const styles = StyleSheet.create({
  pin: {
    position: 'absolute',
    height: 54,
    width: 30, // Assuming the width should match the height for a pin image
    zIndex: 20,
    top: 0, // -4rem = -16 pixels (since 1rem is usually 16px)
  },
  container: {
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  spinButton: {
    position: 'absolute',
    backgroundColor: '#F3B867',
    borderRadius: 50,
    width: 70,
    height: 70,
    borderWidth: 4,
    borderColor: '#F3B867',
    overflow: 'hidden',
  },
  spinButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderWidth: 4,
    borderColor: 'red',
    borderRadius: 50,
  },
  spinButtonText: {
    fontWeight: 'bold',
    color: 'black',
  },
  gradientFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
