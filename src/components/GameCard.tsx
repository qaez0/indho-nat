import { useReducer } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { useGameLogin } from '../hooks/useGameLogin';
import { ISlot } from '../types/slot';
import { imageHandler } from '../utils/image-url';
import Logo from '../assets/logo.svg';
import LottieView from 'lottie-react-native';
import lottieJson from '../assets/loader.json';

type GameCardState = {
  imageLoading: boolean;
  imageError: boolean;
};

type GameCardAction =
  | { type: 'SET_IMAGE_LOADING'; payload: boolean }
  | { type: 'SET_IMAGE_ERROR'; payload: boolean };

const initialState: GameCardState = {
  imageLoading: true,
  imageError: false,
};

const gameCardReducer = (
  state: GameCardState,
  action: GameCardAction,
): GameCardState => {
  switch (action.type) {
    case 'SET_IMAGE_LOADING':
      return { ...state, imageLoading: action.payload };
    case 'SET_IMAGE_ERROR':
      return { ...state, imageError: action.payload };
    default:
      return state;
  }
};

interface IGameCard extends ISlot {
  customWidth?: number;
  customHeight?: number;
}

const GameCard = (slot: IGameCard) => {
  const [state, dispatch] = useReducer(gameCardReducer, initialState);
  const { initializeGame } = useGameLogin();
  const { customWidth, customHeight, ...slotData } = slot;

  const handleGameClick = async () => {
    await initializeGame(slotData);
  };

  const cardWidth = customWidth || 120;
  const cardHeight = customHeight || cardWidth; // Make height same as width to ensure square

  return (
    <TouchableOpacity
      onPress={handleGameClick}
      style={[styles.container, { width: cardWidth, height: cardHeight, aspectRatio: 1 }]}
    >
      <Image
        source={{ uri: imageHandler(slot.img_lnk) }}
        style={[styles.image, { display: state.imageError ? 'none' : 'flex' }]}
        onLoad={() => dispatch({ type: 'SET_IMAGE_LOADING', payload: false })}
        onError={(e) => {
          console.log('Image load error:', e.nativeEvent);
          dispatch({ type: 'SET_IMAGE_LOADING', payload: false });
          dispatch({ type: 'SET_IMAGE_ERROR', payload: true });
        }}
        resizeMode={'cover'}
      />
      {state.imageLoading && (
        <View style={styles.overlay}>
          <LottieView source={lottieJson} autoPlay loop style={styles.lottie} />
        </View>
      )}
      {state.imageError && (
        <View style={styles.overlay}>
          <Logo />
          <Text style={styles.errorText}>{slot.name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default GameCard;

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    flexGrow: 0,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  errorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'var(--font-roboto)',
  },
  lottie: {
    width: 80,
    aspectRatio: 1,
  },
});
