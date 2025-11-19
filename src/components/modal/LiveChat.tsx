import { StyleSheet, Modal, View, Dimensions, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import {
  useCurrentRoute,
  useDrawerState,
  useLiveChat,
} from '../../store/useUIStore';
import { LICENSE_ID, HIDDEN_LIVECHAT_ROUTES } from '../../constants/live-chat';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import ChatSvg from '../../assets/common/content-icons/chat.svg';
import MinimizeSvg from '../../assets/common/content-icons/minimize.svg';

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
      <View style={styles.modalContainer}>
        <WebView
          source={{
            uri: `https://secure.livechatinc.com/customer/action/open_chat?license_id=${LICENSE_ID}`,
          }}
          style={{
            flex: 1,
          }}
        />
        <TouchableOpacity
          onPress={toggleLiveChatModalVisibility}
          style={styles.minimizeButton}
        >
          <MinimizeSvg width={30} height={30} color="white" />
        </TouchableOpacity>
      </View>
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

  // Get screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Animated values for position and opacity
  const translateX = useSharedValue(10); // Initial position from left
  const translateY = useSharedValue(screenHeight - 150); // Initial position from top (above bottom nav)
  const opacity = useSharedValue(1); // Initial opacity

  // Gesture handler for dragging
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startX: number; startY: number; isDragging: boolean }) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      context.isDragging = false;
    },
    onActive: (event, context: { startX: number; startY: number; isDragging: boolean }) => {
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      if (distance > 5) {
        context.isDragging = true;
        // Make button semi-transparent when dragging
        opacity.value = 0.6;
      }
      
      // Only move the button if we're actually dragging
      if (context.isDragging) {
        // Allow free movement through original position
        const newX = context.startX + event.translationX;
        const newY = context.startY + event.translationY;
        
        // Keep within visible screen bounds (excluding header and bottom navigation)
        const buttonSize = 50;
        const padding = 10;
        const headerHeight = 140; // Increased to cover status bar + top nav + main nav tabs
        const bottomNavHeight = 80; // Approximate bottom navigation height
        
        // Constrain X to screen width
        translateX.value = Math.max(padding, Math.min(screenWidth - buttonSize - padding, newX));
        
        // Constrain Y to visible area (between header and bottom nav)
        const minY = headerHeight + padding;
        const maxY = screenHeight - bottomNavHeight - buttonSize - padding;
        translateY.value = Math.max(minY, Math.min(maxY, newY));
      }
    },
    onEnd: (_, context: { startX: number; startY: number; isDragging: boolean }) => {
      // Restore full opacity when drag ends
      opacity.value = 1;
      // No snapping behavior - button stays where you drop it
    },
  });

  // Animated style for the button
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <>
      {liveChatButtonVisibility && !shouldHideLiveChat && !drawerState && (
        <PanGestureHandler 
          onGestureEvent={gestureHandler}
          shouldCancelWhenOutside={false}
        >
          <Animated.View style={[styles.liveChatButton, animatedStyle]}>
            <TouchableOpacity
              onPress={toggleLiveChatModalVisibility}
              style={styles.touchableArea}
              activeOpacity={0.8}
            >
              <ChatSvg
                width={25}
                height={25}
                color="white"
              />
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      )}
      <LiveChatModal />
    </>
  );
};

export default LiveChat;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    position: 'relative',
  },
  minimizeButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  liveChatButton: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#73D943',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  touchableArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
