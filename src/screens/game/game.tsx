import LottieView from 'lottie-react-native';
import {
  View,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import WebView from 'react-native-webview';
import lottieJson from '../../assets/loader.json';
import { useGameDisplay, useLandscapeMode } from '../../store/useUIStore';
import { useTheme } from '@ui-kitten/components';
import QuitModal from './components/QuitModal';
import { useEffect } from 'react';
import DraggableBubble from './components/GameBubble';
import { useNavigation } from '@react-navigation/native';
import { GameNav } from '../../types/nav';
import { useQuitGameDialog } from '../../store/useQuitGameDialog';
import Toast from 'react-native-toast-message';
import { useUser } from '../../hooks/useUser';
import { useTranslation } from 'react-i18next';

const GameScreen = () => {
  const navigation = useNavigation<GameNav>();
  const theme = useTheme();
  const { t } = useTranslation();
  const gameUrl = useGameDisplay(s => s.game_url);
  const { isLandscape, setIsLandscape } = useLandscapeMode();
  const dimensions = useWindowDimensions();
  const openDialog = useQuitGameDialog(s => s.openDialog);
  const { invalidate } = useUser();
  const resetGameDisplay = useGameDisplay(s => s.resetGameDisplay);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsLandscape(window.width > window.height);
    });
    return () => subscription?.remove();
  }, [setIsLandscape]);

  const handlePopoverAction = (action: 'deposit' | 'quit') => {
    if (action === 'deposit') {
      navigation.navigate('in-game-deposit');
    } else {
      openDialog({
        message: t('common-terms.quit-game-confirm'),
        confirmButtonText: t('common-terms.quit'),
        cancelButtonText: t('common-terms.cancel'),
        onConfirm: async () => {
          try {
            Toast.show({ type: 'promise', text1: t('common-terms.logging-out-game') });
            invalidate('balance');
            invalidate('panel-info');
            resetGameDisplay();
            setIsLandscape(false);
          } catch (error) {
            console.error(error);
          } finally {
            Toast.hide();
            navigation.goBack();
          }
        },
      });
    }
  };

  const Loader = () => (
    <View style={styles.loaderContainer}>
      <LottieView source={lottieJson} autoPlay loop style={styles.lottie} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme['bg-secondary'] }}>
      {!!gameUrl ? (
        <WebView
          source={{ uri: gameUrl }}
          startInLoadingState
          renderLoading={Loader}
          allowsBackForwardNavigationGestures
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          style={{ flex: 1, backgroundColor: 'transparent' }}
        />
      ) : (
        <Loader />
      )}
      <QuitModal />
      {isLandscape && (
        <DraggableBubble
          width={dimensions.width}
          height={dimensions.height}
          key={`${dimensions.width}x${dimensions.height}`}
          onPopoverAction={handlePopoverAction}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  lottie: {
    width: 100,
    aspectRatio: 1,
  },
});

export default GameScreen;
