import { useCountdownFormattedHours } from '../../utils/time';

import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import FadeSlideInView from '../../animations/FadeSlideInView';
import LinearGradient from 'react-native-linear-gradient';

interface CongratulationsProps {
  onClickWithdraw: () => void;
  rewardAmount: number;
  eventStartTime: string;
  eventEndTime: string;
}

const Congratulations = ({
  onClickWithdraw,
  rewardAmount,
  // eventStartTime,
  eventEndTime,
}: CongratulationsProps) => {
  const remainingTime = useCountdownFormattedHours(eventEndTime);
  const { width: windowWidth } = useWindowDimensions();
  return (
    <FadeSlideInView durationMs={600}>
      <View style={styles.root}>
        <Image
          source={require('../../../../assets/lucky-spin/random-cards/ribbon.png')}
          style={{ width: windowWidth - 16, height: 40 }}
          resizeMode="contain"
        />
        <Image
          source={require('../../../../assets/lucky-spin/random-cards/congrats-title.png')}
          style={{ width: windowWidth - 16, height: 70 }}
          resizeMode="contain"
        />

        <LinearGradient
          colors={['#D0121D', '#F2272C', '#F2272C', '#D0121D']}
          style={styles.cardPanel}
        >
          <View style={styles.countdownPill}>
            <Text category="c2" style={styles.countdownText}>
              Countdown {remainingTime}
            </Text>
          </View>

          <View style={styles.prizeBoxWrapper}>
            <LinearGradient
              style={styles.prizeBox}
              colors={['#FFD888', '#FFA400']}
            >
              <Text category="h4" style={styles.prizeText}>
                PKR {rewardAmount}
              </Text>
              <View style={styles.withdrawHintPill}>
                <Text category="c2" style={styles.withdrawHintText}>
                  Withdraw money over PKR 1000
                </Text>
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={onClickWithdraw}
          >
            <LinearGradient
              colors={['#FFDB3A', '#FF4D00']}
              locations={[0, 1]}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flex: 1,
              }}
            >
              <Text
                category="h1"
                style={{
                  letterSpacing: 1,
                  fontSize: 18,
                  fontWeight: '900',
                  textShadowColor: '#D06E25',
                  textShadowRadius: 1,
                  textShadowOffset: { width: 3, height: 3 },
                }}
              >
                WITHDRAW NOW
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </FadeSlideInView>
  );
};

export default Congratulations;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPanel: {
    width: '100%',
    padding: 12,
    gap: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  countdownPill: {
    backgroundColor: '#921A19',
    minHeight: 24,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  countdownText: {
    color: '#F6CE37',
  },
  prizeBoxWrapper: {
    backgroundColor: '#921A19',
    borderRadius: 8,
    padding: 12,
  },
  prizeBox: {
    borderRadius: 8,
    width: '100%',
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA400',
    padding: 8,
  },
  prizeText: {
    color: '#E6122B',
    fontWeight: '900',
  },
  withdrawHintPill: {
    backgroundColor: '#FC7600',
    minHeight: 20,
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginTop: 6,
  },
  withdrawHintText: {
    color: '#fff',
    letterSpacing: 1,
  },
  withdrawButton: {
    borderRadius: 8,
    minHeight: 44,
    overflow: 'hidden',
  },
});
