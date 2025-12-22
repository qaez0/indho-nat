import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { imageHandler } from '../../../utils/image-url';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { TabNav } from '../../../types/nav';
import { useTranslation } from 'react-i18next';
import { useGameLogin } from '../../../hooks/useGameLogin';
import { ISlot } from '../../../types/slot';
import LottieView from 'lottie-react-native';
import lottieJson from '../../../assets/common/home/feature-banner/riseofseth.mp4.lottie.json';

interface FeatureBannerProps {
  title: string;
  subtitle?: string;
  image: string;
  gradient: string[];
  backgroundImage?: string;
  lottieSource?: typeof lottieJson | string | { uri: string };
  lottieStyle?: object;
  showGradient?: boolean;
  onPress: () => void;
}

const FeatureBanner: React.FC<FeatureBannerProps> = ({
  title,
  subtitle,
  image,
  gradient,
  backgroundImage,
  lottieSource,
  lottieStyle,
  showGradient = true,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showGradient) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [pulseAnim, showGradient]);

  return (
    <TouchableOpacity style={styles.banner} onPress={onPress}>
      {lottieSource ? (
        <View style={styles.lottieWrapper}>
          <LottieView
            source={lottieSource}
            autoPlay
            loop
            style={[styles.lottieContainer, lottieStyle]}
          />
        </View>
      ) : null}
      {showGradient && (
        <LinearGradient
          colors={gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {image && (
            <Animated.View
              style={[styles.bannerImage, { transform: [{ scale: pulseAnim }] }]}
            >
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="contain"
              />
            </Animated.View>
          )}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const FeatureBanners: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<TabNav>();
  const { initializeGame } = useGameLogin();

  const handleInvitePress = () => {
    navigation.jumpTo('earn');
  };

  const handleriseofseth = async () => {
    await initializeGame({
      url: '/Login/GameLogin/efg/rise-of-seth',
    } as ISlot);
  };

  return (
    <View style={styles.container}>
      <FeatureBanner
        title={t('feature-banners.invite-friends')}
        subtitle={t('feature-banners.get-rebates')}
        image={imageHandler('/images/common/home/feature-banner/gift.png')}
        gradient={['#ebb264', '#e0880f']}
        onPress={handleInvitePress}
      />

      <FeatureBanner
        title=""
        image=""
        gradient={['#60b517', '#457918']}
        lottieSource={lottieJson}
        lottieStyle={{
          width: '100%',
          height: '100%',
        }}
        showGradient={false}
        onPress={handleriseofseth}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  banner: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    height: 60,
  },
  gradient: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    position: 'relative',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
    maxWidth: '80%',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerImage: {
    position: 'absolute',
    bottom: '-10%',
    right: '-19%',
    height: '190%',
    width: '90%',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
 
  lottieWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    overflow: 'hidden',
  },
  lottieContainer: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.2 }],
  },
});

export default FeatureBanners;
