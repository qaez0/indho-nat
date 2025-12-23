import LottieView from 'lottie-react-native';
import {
  View,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';
import lottieJson from '../../assets/loader.json';
import { useGameDisplay, useLandscapeMode, useGlobalLoader } from '../../store/useUIStore';
import { useTheme } from '@ui-kitten/components';
import QuitModal from './components/QuitModal';
import { useEffect, useState } from 'react';
import React from 'react';
import DraggableBubble from './components/GameBubble';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GameNav } from '../../types/nav';
import { useQuitGameDialog } from '../../store/useQuitGameDialog';
import Toast from 'react-native-toast-message';
import { useUser } from '../../hooks/useUser';
import { useTranslation } from 'react-i18next';
import Orientation from 'react-native-orientation-locker';
import { Linking } from 'react-native';

// Safe wrapper for orientation methods
const safeOrientationCall = (method: () => void) => {
  try {
    if (Orientation && typeof Orientation.unlockAllOrientations === 'function' && 
        typeof Orientation.lockToLandscape === 'function' && 
        typeof Orientation.lockToPortrait === 'function') {
      method();
    } else {
      console.warn('Orientation module methods not available. Please rebuild the app.');
    }
  } catch (error) {
    console.warn('Orientation module error:', error);
  }
};

// Loader component moved outside to avoid re-creation on every render
const Loader = () => (
  <View style={styles.loaderContainer}>
    <LottieView source={lottieJson} autoPlay loop style={styles.lottie} />
  </View>
);

const MAX_GAME_LOADER_MS = 5000;

const GameScreen = () => {
  const navigation = useNavigation<GameNav>();
  const theme = useTheme();
  const { t } = useTranslation();
  const gameUrl = useGameDisplay(s => s.game_url);
  const gameData = useGameDisplay(s => s.data);
  const { isLandscape, setIsLandscape } = useLandscapeMode();
  const dimensions = useWindowDimensions();
  const openDialog = useQuitGameDialog(s => s.openDialog);
  const { invalidate } = useUser();
  const resetGameDisplay = useGameDisplay(s => s.resetGameDisplay);
  const closeLoader = useGlobalLoader(state => state.closeLoader);
  const [hasClosedLoader, setHasClosedLoader] = useState(false);

  // Check if current game is CQ9
  const isCQ9Game = gameData?.game_id === 'CQ9';

  useEffect(() => {
    // For CQ9 games, lock to landscape. For other games, unlock all orientations so user can rotate freely
    if (isCQ9Game) {
      // console.log('CQ9 game detected, locking to landscape');
      safeOrientationCall(() => {
        Orientation.unlockAllOrientations();
        Orientation.lockToLandscape();
      });
    } 
    else {
      // For other games, unlock all orientations so user can rotate to landscape if they want
      // console.log('Non-CQ9 game, unlocking all orientations');
      safeOrientationCall(() => {
        Orientation.unlockAllOrientations();
      });
    }
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsLandscape(window.width > window.height);
    });
    
    return () => {
      subscription?.remove();
      // Unlock orientation when leaving game screen and return to portrait
      safeOrientationCall(() => {
        Orientation.unlockAllOrientations();
        Orientation.lockToPortrait();
      });
    };
  }, [setIsLandscape, isCQ9Game]);

  // Also handle focus/blur events for navigation
  useFocusEffect(
    React.useCallback(() => {
      // For CQ9 games, lock to landscape. For other games, unlock all orientations
      if (isCQ9Game) {
        safeOrientationCall(() => {
          Orientation.unlockAllOrientations();
          Orientation.lockToLandscape();
        });
      } 
      else {
        safeOrientationCall(() => {
          Orientation.unlockAllOrientations();
        });
      }
      
      return () => {
        // Unlock when screen loses focus and return to portrait
        safeOrientationCall(() => {
          Orientation.unlockAllOrientations();
          Orientation.lockToPortrait();
        });
      };
    }, [isCQ9Game]),
  );

  const handlePopoverAction = (action: 'deposit' | 'quit') => {
    if (action === 'deposit') {
      navigation.navigate('in-game-deposit');
    } else {
      openDialog({
        message: t('common-terms.quit-game-confirm'),
        confirmButtonText: t('common-terms.quit'),
        cancelButtonText: t('common-terms.cancel'),
        onConfirm: async () => {
          Toast.show({ type: 'promise', text1: t('common-terms.logging-out-game') });
          try {
            setIsLandscape(false);
            // Unlock orientation when quitting game
            safeOrientationCall(() => {
              Orientation.unlockAllOrientations();
              Orientation.lockToPortrait();
            });
          } catch (error) {
            console.error(error);
          } finally {
            Toast.hide();
            navigation.goBack();
            // Invalidate user data and reset game AFTER quitting the game
            invalidate('balance');
            invalidate('panel-info');
            resetGameDisplay();
          }
        },
      });
    }
  };

  // Close loader when WebView loads (game is ready) - fallback timeout
  useEffect(() => {
    if (!gameUrl || hasClosedLoader) {
      return;
    }

    // Calculate remaining time from when loader started (max 5 seconds total)
    const startTime = useGlobalLoader.getState().startTime;
    let remainingTime = MAX_GAME_LOADER_MS;
    if (startTime) {
      const elapsed = Date.now() - startTime;
      remainingTime = Math.max(0, MAX_GAME_LOADER_MS - elapsed);
    }

    // Set up a timeout as fallback (in case onLoadEnd doesn't fire)
    const timeoutId = setTimeout(() => {
      if (!hasClosedLoader) {
        closeLoader();
        setHasClosedLoader(true);
      }
    }, remainingTime);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [gameUrl, closeLoader, hasClosedLoader]);

  // Reset hasClosedLoader when game_url changes (new game is loading)
  useEffect(() => {
    if (gameUrl) {
      setHasClosedLoader(false);
    }
  }, [gameUrl]);


  // Handle navigation events to intercept deep link redirects (return_url)
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const url = navState.url;
    // Check if the game is trying to redirect to our deep link (return_url)
    if (url && url.startsWith('game11ic://')) {
      // Handle the deep link redirect - navigate back or to home
      navigation.goBack();
      resetGameDisplay();
      invalidate('balance');
      invalidate('panel-info');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme['bg-secondary'] }]}>
      {gameUrl ? (
        <WebView
          source={{ uri: gameUrl }}
          startInLoadingState
          renderLoading={Loader}
          allowsBackForwardNavigationGestures
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          onLoadEnd={() => {
            // Close loader when WebView has loaded
            if (!hasClosedLoader) {
              closeLoader();
              setHasClosedLoader(true);
            }
          }}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={(request) => {
            // Intercept deep link redirects before they load
            if (request.url && request.url.startsWith('game11ic://')) {
              Linking.openURL(request.url).catch(() => {
                // If opening fails, just navigate back
                navigation.goBack();
                resetGameDisplay();
                invalidate('balance');
                invalidate('panel-info');
              });
              return false; // Prevent WebView from loading the deep link
            }
            return true; // Allow normal navigation
          }}
          style={styles.webView}
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
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
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
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default GameScreen;
