import { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Modal, Button, Text, useTheme } from '@ui-kitten/components';
import { useQuitGameDialog } from '../../../store/useQuitGameDialog';

const QuitModal = () => {
  const { visible, options, closeDialog } = useQuitGameDialog();
  const theme = useTheme();

  const slideAnim = useRef(new Animated.Value(300)).current;
  const [isMounted, setIsMounted] = useState(visible);

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

  const dialogContent = (
    <View style={styles.contentContainer}>
      <Button
        appearance="ghost"
        status="basic"
        onPress={closeDialog}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </Button>
      <Text style={styles.messageText}>{options?.message}</Text>
      <View style={styles.buttonContainer}>
        <Button
          appearance="ghost"
          status="basic"
          onPress={closeDialog}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>
            {options?.cancelButtonText}
          </Text>
        </Button>
        <Button
          appearance="filled"
          status="warning"
          onPress={() => {
            options?.onConfirm?.();
            closeDialog();
          }}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>
            {options?.confirmButtonText}
          </Text>
        </Button>
      </View>
    </View>
  );

  return (
    <Modal
      visible={isMounted}
      backdropStyle={styles.backdrop}
      shouldUseContainer={false}
      onBackdropPress={closeDialog}
      animationType="none"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: theme['bg-secondary'] ?? '#121212' },
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {dialogContent}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

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
  },
  contentContainer: {
    alignItems: 'center',
    position: 'relative',
    // paddingTop: 8,
  },
  closeButton: {
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    padding: 6,
    minWidth: 32,
    minHeight: 32,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    color: '#D0D0D0',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,

  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#EFB064',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  confirmButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuitModal;
