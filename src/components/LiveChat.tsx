import { StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import {
  useCurrentRoute,
  useDrawerState,
  useLiveChat,
} from '../store/useUIStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LICENSE_ID, HIDDEN_LIVECHAT_ROUTES } from '../constants/live-chat';

const LiveChatModal = () => {
  const liveChatModalVisibility = useLiveChat(
    state => state.liveChatModalVisibility,
  );
  const toggleLiveChatModalVisibility = useLiveChat(
    state => state.toggleLiveChatModalVisibility,
  );
  return (
    <Modal
      visible={liveChatModalVisibility}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={toggleLiveChatModalVisibility}
    >
      <WebView
        source={{
          uri: `https://secure.livechatinc.com/customer/action/open_chat?license_id=${LICENSE_ID}`,
        }}
        style={{
          flex: 1,
        }}
      />
    </Modal>
  );
};
const LiveChat = () => {
  const toggleLiveChatModalVisibility = useLiveChat(
    state => state.toggleLiveChatModalVisibility,
  );
  const liveChatButtonVisibility = useLiveChat(
    state => state.liveChatButtonVisibility,
  );
  const currentRoute = useCurrentRoute(state => state.currentRoute);
  const shouldHideLiveChat = HIDDEN_LIVECHAT_ROUTES.includes(
    currentRoute || '',
  );
  const drawerState = useDrawerState(state => state.drawerState);

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.liveChatContainer, StyleSheet.absoluteFillObject]}
    >
      {liveChatButtonVisibility && !shouldHideLiveChat && !drawerState && (
        <TouchableOpacity
          onPress={toggleLiveChatModalVisibility}
          style={styles.liveChatButton}
        >
          <Image
            source={require('../assets/common/chat-supp.png')}
            style={{
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>
      )}
      <LiveChatModal />
    </SafeAreaView>
  );
};

export default LiveChat;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  liveChatButton: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#343633',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
  },
  liveChatContainer: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 10,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
    paddingBottom: 70,
  },
});
