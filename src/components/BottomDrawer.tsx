import { useRef, useEffect, useState, PropsWithChildren } from 'react';
import {
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Modal, useTheme } from '@ui-kitten/components';
import { useBottomDrawer, type DialogDrawerState } from '../hooks/useUIHelpers';
import Toast from 'react-native-toast-message';
import toastConfig from './toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomDrawer = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  const visible = useBottomDrawer((state: DialogDrawerState) => state.visible);
  const closeDialog = useBottomDrawer(
    (state: DialogDrawerState) => state.closeDialog,
  );
  const theme = useTheme();

  const slideAnim = useRef(new Animated.Value(300)).current;
  const [isMounted, setIsMounted] = useState(visible);
  const [behaviour, setBehaviour] = useState<'height' | undefined>('height');

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setBehaviour('height');
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setBehaviour(undefined);
    });
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsMounted(false);
      });
    }
  }, [visible]);

  if (!isMounted) return null;

  return (
    <Modal
      visible={isMounted}
      backdropStyle={styles.backdrop}
      shouldUseContainer={false}
      onBackdropPress={closeDialog}
      animationType="none"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : behaviour}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Animated.View
          style={[
            styles.sheet,

            {
              backgroundColor: theme['bg-secondary'] ?? '#1A1A1A',
              paddingBottom: insets.bottom + 15,
            },
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} position="top" visibilityTime={3000} />
    </Modal>
  );
};

export default BottomDrawer;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxHeight: '80%',
    minHeight: 200,
  },
});
