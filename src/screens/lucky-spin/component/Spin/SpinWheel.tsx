// import { Box, Button, Typography } from "@mui/material"; // commented: web-only
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  Easing,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import type { Reward } from '.';
import { useCountdownFormattedHours } from '../../utils/time';
import { useLuckySpin } from '../../useLuckySpin';
import LinearGradient from 'react-native-linear-gradient';
// import { toast } from "sonner"; // commented: web-only
// import { imageHandler } from "../../../../utils/image-url"; // commented: web-only

// Interface for rewards with degree
// interface RewardWithDegree extends Reward {
//   degree: number;
// }

//temporary props
interface SpinWheelProps {
  onInvite: () => void;
  onWin: (reward: Reward) => void;
  totalSpinLeft: number;
  eventEndTime: string;
}

interface SpinWheelUIProps {
  onWin: (reward: Reward) => void;
  totalSpinLeft: number;
}

// interface DegreeGuideProps {
//   rotationDegree: number;
//   isSpinning: boolean;
//   spinPhase: "initial" | "final";
//   rewards: RewardWithDegree[];
// }

const SpinWheel = ({
  onInvite,
  onWin,
  totalSpinLeft,
  eventEndTime,
}: SpinWheelProps) => {
  const remainingTime = useCountdownFormattedHours(eventEndTime);

  return (
    <View style={styles.container}>
      <View style={styles.headerStrip}>
        <Image
          source={require('../../../../assets/lucky-spin/spin/strip-design.png')}
          style={styles.headerStripImage}
          resizeMode="cover"
        />
        <View style={styles.countdownPill}>
          <Text style={styles.countdownText}>Countdown {remainingTime}</Text>
        </View>
      </View>

      <LinearGradient
        colors={['#D0121D', '#F2272C', '#F2272C', '#D0121D']}
        style={styles.panel}
      >
        <SpinWheelUI onWin={onWin} totalSpinLeft={totalSpinLeft} />
        <TouchableOpacity style={styles.inviteButton} onPress={onInvite}>
          <LinearGradient
            colors={['#ffdd17', '#f57009']}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Text
              category="h6"
              // style={{
              //   letterSpacing: 1,
              //   fontSize: 18,
              //   fontWeight: '900',
              //   textShadowColor: '#D06E25',
              //   textShadowRadius: 1,
              //   textShadowOffset: { width: 3, height: 3 },
              // }}
            >
              INVITE TO EARN SPIN
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.nextFreeSpinWrapper}>
          <Text category="c2" style={styles.nextFreeSpinText}>
            Next FREE SPIN {remainingTime}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default SpinWheel;

const SpinWheelUI = ({ onWin, totalSpinLeft }: SpinWheelUIProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const [rotationDegree, setRotationDegree] = useState(0);
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  const { width } = useWindowDimensions();

  // Responsive sizing based on screen width
  const panelHorizontalPadding = 40; // matches panel paddingHorizontal: 20 on both sides
  const availableWidth = Math.max(0, width - panelHorizontalPadding);
  const baseWheelSize = 224;
  const wheelSize = Math.min(availableWidth * 0.8, 320);
  const scale = wheelSize / baseWheelSize || 1;
  const guideWidth = 120 * scale;
  const guideHeight = 122 * scale;
  const guideTop = 7 * scale;
  const btnWidth = 63 * scale;
  const btnHeight = 76 * scale;
  const btnLeft = (wheelSize - btnWidth) / 2;
  const btnTop = (wheelSize - btnHeight) / 2;
  const labelTop = 27 * scale;

  useEffect(() => {
    setSpinsRemaining(totalSpinLeft);
  }, [totalSpinLeft]);
  const { pickSpin } = useLuckySpin();
  // Using a constant list that does not change across renders
  const rewardsWithDegreesRef = useRef([
    { id: 1, degree: 60 },
    { id: 2, degree: 120 },
    { id: 3, degree: 180 },
    { id: 4, degree: 240 },
    { id: 5, degree: 300 },
    { id: 6, degree: 360 },
  ] as const);

  const handleSpin = useCallback(async () => {
    if (isSpinning || spinsRemaining <= 0) return;
    const randomIndex = Math.floor(
      Math.random() * rewardsWithDegreesRef.current.length,
    );
    const selectedReward = rewardsWithDegreesRef.current[randomIndex];
    if (selectedReward === null) return;

    const extraSpins = 5;
    const currentNormalizedDegree = rotationDegree % 360;
    let degreesToTarget = selectedReward.degree - currentNormalizedDegree;

    if (degreesToTarget <= 0) {
      degreesToTarget += 360;
    }

    const totalRotation = extraSpins * 360 + degreesToTarget;

    setIsSpinning(true);
    setSpinsRemaining(prev => prev - 1);
    Animated.timing(rotation, {
      toValue: rotationDegree + totalRotation,
      duration: 3600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(async () => {
      setIsSpinning(false);
      setRotationDegree(prev => prev + totalRotation);
      try {
        const response = await pickSpin();
        if (response?.data) {
          onWin(response.data[0]);
        }
      } catch (error) {
        // Error handled silently
      }
    });
  }, [isSpinning, spinsRemaining, rotationDegree, rotation, onWin, pickSpin]);

  return (
    <View
      style={[styles.wheelContainer, { width: wheelSize, height: wheelSize }]}
    >
      {/* <DegreeGuide
        rotationDegree={rotationDegree}
        isSpinning={isSpinning}
        spinPhase={spinPhase}
        rewards={rewardsWithDegrees}
      /> */}
      <Animated.View
        style={[
          styles.wheel,
          {
            borderRadius: wheelSize / 2,
            padding: 6 * scale,
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require('../../../../assets/lucky-spin/spin/wheel-of-fortune.png')}
          style={styles.wheelImage}
          resizeMode="cover"
        />
      </Animated.View>
      <Image
        source={require('../../../../assets/lucky-spin/spin/wheel-guide.png')}
        style={[
          styles.wheelGuide,
          { width: guideWidth, height: guideHeight, top: guideTop },
        ]}
        resizeMode="contain"
      />
      <TouchableOpacity
        disabled={isSpinning || spinsRemaining <= 0}
        onPress={handleSpin}
        style={[
          styles.spinButton,
          { width: btnWidth, height: btnHeight, left: btnLeft, top: btnTop },
          isSpinning || spinsRemaining <= 0 ? styles.spinButtonDisabled : null,
        ]}
      >
        <Image
          source={
            isSpinning || spinsRemaining <= 0
              ? require('../../../../assets/lucky-spin/spin/wheel-btn-inactive.png')
              : require('../../../../assets/lucky-spin/spin/wheel-btn-active.png')
          }
          style={styles.spinButtonImage}
          resizeMode="cover"
        />
        <View style={[styles.spinButtonLabelContainer, { top: labelTop }]}>
          <Text category="c2" style={styles.spinLabel}>
            SPIN
          </Text>
          <Text
            category="h6"
            style={[styles.spinCount, { lineHeight: 22 * scale }]}
          >
            {spinsRemaining}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerStrip: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#D0121D',
    boxSizing: 'border-box',
    paddingHorizontal: 20,
    justifyContent: 'center',
    minHeight: 35,
    overflow: 'hidden',
  },
  headerStripImage: {
    ...StyleSheet.absoluteFillObject,
  },
  countdownPill: {
    backgroundColor: '#921A19',
    minHeight: 22,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: '#F6CE37',
  },
  panel: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 6,
  },
  inviteButton: {
    borderRadius: 8,
    minHeight: 44,
    width: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  wheelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 224,
    height: 224,
  },
  wheel: {
    width: '100%',
    height: '100%',
    borderRadius: 224 / 2,
    backgroundColor: '#7E0F15',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelImage: {
    width: '100%',
    height: '100%',
  },
  wheelGuide: {
    width: 120,
    height: 122,
    position: 'absolute',
    top: 7,
  },
  spinButton: {
    height: 76,
    width: 63,
    position: 'absolute',
  },
  spinButtonDisabled: {
    opacity: 0.7,
  },
  spinButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  spinButtonLabelContainer: {
    position: 'absolute',
    top: 27,
    width: '100%',
    alignItems: 'center',
  },
  spinLabel: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  spinCount: {
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  nextFreeSpinWrapper: {
    paddingVertical: 6,
  },
  nextFreeSpinText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
