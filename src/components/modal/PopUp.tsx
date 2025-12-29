import { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from 'react-native';
import { Button, Modal } from '@ui-kitten/components';
import { useAuthModal, usePopUp } from '../../store/useUIStore';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import {
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { data } from '../../constants/popup';
import { RootStackNav } from '../../types/nav';
import { useUser } from '../../hooks/useUser';
import { useTranslation } from 'react-i18next';
import {useGameLogin} from '../../hooks/useGameLogin';
import { useGlobalLoader } from "../../store/useUIStore";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ISlot } from '../../types/slot';
const PopUp = () => {
  const {initializeGame} = useGameLogin();
  const { isOpen, closePopUp } = usePopUp();
  const navigation = useNavigation<RootStackNav>();
  const { isAuthenticated } = useUser();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(0);
  const [isLayoutReady, setIsLayoutReady] = useState<boolean>(false);
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const openDialog = useAuthModal((state: any) => state.openDialog);
  const openLoader = useGlobalLoader((state) => state.openLoader);

  // Map popup IDs to translation keys
  const getTranslatedTitle = (id: string) => {
    const translationMap: Record<string, string> = {
      'wheel': t('common-terms.win-oppo'),
      'lucky-spin': t('common-terms.free-1000-bonus'),
      'rise-of-seth': t('common-terms.free-spin-bonus'),
      'invite': t('common-terms.refer-earn'),
    };
    return translationMap[id] || '';
  };

  // Reset layout ready state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLayoutReady(false);
    }
  }, [isOpen]);

  const handleButtonClick = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        count: index - progress.value,
        animated: true,
      });
    }
  };

  useAnimatedReaction(
    () => progress.value,
    currentProgress => {
      const newIndex = Math.round(currentProgress) % data.length;
      runOnJS(setSelected)(newIndex);
    },
  );

  const handleImageClick = (id: string) => {
    if (!isAuthenticated) {
      closePopUp();
      openDialog();
      return;
    }
    switch (id) {
      case 'lucky-spin':
        navigation.navigate('lucky-spin');
        break;
      case 'wheel':
        navigation.navigate('main-tabs', {
          screen: 'tabs',
          params: {
            screen: 'wheel',
          },
        });
        break;

     
        case "rise-of-seth":
          if (isAuthenticated) {
            // Set flag to indicate user is navigating to game
            AsyncStorage.setItem("navigated-to-game", "true");
            // Show game loader immediately to block all interactions
            openLoader("Game loading...");
            // Close popup and initialize game
            closePopUp();
            initializeGame({ url: "/Login/GameLogin/efg/rise-of-seth/" } as ISlot);
            return; // Return early to prevent closePopUp from being called again
          } else {
            openDialog();
          }
          break;
    
      case 'invite':
        navigation.navigate('main-tabs', {
          screen: 'tabs',
          params: {
            screen: 'earn',
          },
        });
        break;
      default:
        console.warn('Unknown navigation route:', id);
    }
    closePopUp();
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      onPress={() => handleImageClick(item.id)}
      activeOpacity={0.9}
      key={index}
      style={styles.carouselItem}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isOpen}
      backdropStyle={styles.modalBackdrop}
      onBackdropPress={closePopUp}
      animationType="fade"
      hardwareAccelerated={true}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: 15,
        zIndex: 2000,
      }}
    >
      <View style={styles.modalContent}>
        <View style={styles.tabContainer}>
          {data.map((item: any, index: number) => (
            <Button
              key={index}
              size="medium"
              style={[
                styles.tabButton,
                selected === index && styles.activeTabButton,
              ]}
              onPress={() => handleButtonClick(index)}
            >
              <Text
                style={styles.tabButtonText}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.9}
              >
                {getTranslatedTitle(item.id)}
              </Text>
            </Button>
          ))}
        </View>

        <View 
          style={styles.carouselContainer}
          onLayout={() => setIsLayoutReady(true)}
        >
          <Carousel
            ref={carouselRef}
            loop
            width={screenWidth - 50}
            height={screenHeight * 0.68}
            data={data}
            scrollAnimationDuration={1000}
            onProgressChange={progress}
            renderItem={renderItem}
            autoPlay={isLayoutReady}
            autoPlayInterval={3000}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 1,
              parallaxScrollingOffset: 30,
              parallaxAdjacentItemScale: 0.8,
            }}
          />
        </View>

        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closePopUp}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    display: 'flex',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    backgroundColor: 'rgba(243, 184, 103, 0.4)',
    borderColor: '#F3B867',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 0,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#F3B867',
    height: 48,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  carouselItem: {
    width: '100%',
    height: '100%',
  },

  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  closeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    minHeight: 62,
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E1E1E',
    borderWidth: 2,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PopUp;
