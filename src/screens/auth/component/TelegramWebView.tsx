import { StyleSheet, Modal } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { TB_BOT_ID } from '@env';
import { Buffer } from 'buffer';

interface TelegramWebViewProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export default function TelegramWebView({
  visible,
  onClose,
  onSuccess,
}: TelegramWebViewProps) {
  const TELEGRAM_URL = `https://oauth.telegram.org/auth?bot_id=${TB_BOT_ID}&origin=${encodeURIComponent(
    'https://11ic.pk',
  )}&return_to=${encodeURIComponent('11icindia://auth')}`;

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.url.includes('https://11ic.pk')) {
      const url = new URL(navState.url);
      const hash = url.hash;

      if (hash && hash.includes('tgAuthResult=')) {
        const tgAuthResult = hash.split('tgAuthResult=')[1];

        try {
          const base64 = tgAuthResult;
          const jsonString = Buffer.from(base64, 'base64').toString('utf-8');
          const data = JSON.parse(jsonString);

          onSuccess(data);
          onClose();
        } catch (decodeError) {
          try {
            const jsonData = JSON.parse(tgAuthResult);
            onSuccess(jsonData);
          } catch (jsonError) {
            onSuccess(tgAuthResult);
          }
          onClose();
        }
      } else {
        const searchParams = url.searchParams;
        const authParams: any = {};
        [
          'id',
          'first_name',
          'last_name',
          'username',
          'photo_url',
          'auth_date',
          'hash',
        ].forEach(param => {
          const value = searchParams.get(param);
          if (value) {
            authParams[param] = value;
          }
        });

        if (Object.keys(authParams).length > 0) {
          onSuccess(authParams);
        } else {
          onSuccess(navState.url);
        }
        onClose();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <WebView
        source={{ uri: TELEGRAM_URL }}
        style={styles.container}
        onNavigationStateChange={handleNavigationStateChange}
        onError={() => {}}
        onLoadEnd={() => {}}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
