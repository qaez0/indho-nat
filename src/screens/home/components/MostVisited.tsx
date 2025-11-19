import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Animated,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import { useGameLogin } from '../../../hooks/useGameLogin';
import { useNavigation } from '@react-navigation/native';
import { ISlot } from '../../../types/slot';
import { useTranslation } from 'react-i18next';

interface MostVisitedItem {
  title: string;
  icon: any;
  url: string;
  isActive: boolean;
  isExternal?: boolean;
  isGame?: boolean;
}

const MostVisited: React.FC = () => {
  const navigation = useNavigation<any>();
  const { initializeGame } = useGameLogin();
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing animation effect for Aviator icon
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseAnim]);

  const mostVisitedData: MostVisitedItem[] = [
    {
      title: 'EXCHANGE',
      icon: require('../../../assets/common/home/most-visited/exchange.png'),
      url: '/Login/GameLogin/nw/lobby',
      isActive: true,
      isExternal: true,
      isGame: true,
    },
    {
      title: 'AVIATOR',
      icon: require('../../../assets/common/home/most-visited/aviator.png'),
      url: '/Login/GameLogin/spribe/spb_aviator',
      isActive: true,
      isGame: true,
    },
    {
      title: 'CASINO',
      icon: require('../../../assets/common/home/most-visited/casino.png'),
      url: '/casino',
      isActive: true,
    },
    {
      title: 'AFFILIATE',
      icon: require('../../../assets/common/home/most-visited/affiliate.png'),
      url: '/affiliate',
      isActive: true,
    },
    
    {
      title: 'REWARDS',
      icon: require('../../../assets/common/home/most-visited/rewards-web-icon.png'),
      url: '/bonus',
      isActive: true,
      // isGame: true,
    },
    {
      title: 'FISHING',
      icon: require('../../../assets/common/home/most-visited/fishing-mobile-icon.png'),
      url: '/Login/GameLogin/jili/1',
      isActive: true,
      isGame: true,
    },
  ];

  const getTranslatedTitle = (title: string): string => {
    const titleMap: { [key: string]: string } = {
      'EXCHANGE': t('most-visited-items.exchange', { defaultValue: 'EXCHANGE' }),
      'AVIATOR': t('most-visited-items.aviator', { defaultValue: 'AVIATOR' }),
      'CASINO': t('most-visited-items.casino', { defaultValue: 'CASINO' }),
      'AFFILIATE': t('most-visited-items.affiliate', { defaultValue: 'AFFILIATE' }),
      'REWARDS': t('most-visited-items.rewards', { defaultValue: 'REWARDS' }),
      'FISHING': t('most-visited-items.fishing', { defaultValue: 'FISHING' }),
    };
    const translated = titleMap[title];
    // If translation returns the key itself (not found), use the original title
    if (translated && translated.startsWith('most-visited-items.')) {
      return title;
    }
    return translated || title;
  };

  const handleItemPress = async (item: MostVisitedItem) => {
    if (!item.isActive) return;

    try {
      // Handle different types of navigation
      if (item.isGame) {
        // For games (EXCHANGE, AVIATOR, SPORTS)
        await initializeGame({ url: item.url } as ISlot);
      } else {
        switch (item.title) {
          case 'CASINO':
            navigation.navigate('casino');
            break;
          case 'AFFILIATE':
            navigation.navigate('affiliate');
            break;
          case 'REWARDS':
            navigation.navigate('bonus');
            break;
          default:
            console.log('Unknown navigation target:', item.title);
        }
      }
    } catch (error) {
      console.error('Navigation error for', item.title, ':', error);
    }
  };

  return (
    <View style={styles.container}>
      {mostVisitedData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.itemButton, !item.isActive && styles.disabledButton]}
          onPress={() => handleItemPress(item)}
          disabled={!item.isActive}
        >
          <LinearGradient
            colors={['#ebb264', '#e0880f']}
            style={styles.gradient}
          >
            {item.title === 'AVIATOR' ? (
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <Image
                  source={item.icon}
                  style={[styles.itemIcon, styles.aviatorIcon]}
                  resizeMode="contain"
                />
              </Animated.View>
            ) : (
              <Image
                source={item.icon}
                style={styles.itemIcon}
                resizeMode="contain"
              />
            )}
            <Text
              style={[styles.itemText, !item.isActive && styles.disabledText]}
            >
              {getTranslatedTitle(item.title)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemButton: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '32%',
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  disabledButton: {
    backgroundColor: '#666',
    shadowColor: '#333',
  },
  itemIcon: {
    width: 35,
    height: 35,
  },
  aviatorIcon: {
    width: 55,
    height: 35,
  },
  itemText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 12,
  },
  disabledText: {
    color: '#999',
  },
});

export default MostVisited;
