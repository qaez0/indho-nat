import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import lottieJson from '../../assets/loader.json';
import { useGameDisplay } from '../../store/useUIStore';
import { useTheme } from '@ui-kitten/components';
import QuitModal from './components/QuitModal';

const PaymentGatewayScreen = () => {
  const theme = useTheme();
  const gateway = useGameDisplay(s => s.deposit_gateway);

  const Loader = () => (
    <View style={styles.loaderContainer}>
      <LottieView source={lottieJson} autoPlay loop style={styles.lottie} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme['bg-secondary'] }}>
      {!!gateway ? (
        <WebView
          source={{ uri: gateway }}
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

export default PaymentGatewayScreen;
