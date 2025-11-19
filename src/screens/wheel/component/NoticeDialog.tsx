import { Modal, Button, Text, useTheme } from '@ui-kitten/components';
import { TouchableOpacity, View } from 'react-native';
import { useNoticeDialog } from '../hooks/useNoticeDialog';
import Feather from '@react-native-vector-icons/feather';

const NoticeDialog = () => {
  const { visible, close, config } = useNoticeDialog();
  const theme = useTheme();

  if (!config) return null;
  return (
    <Modal
      visible={visible}
      backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onBackdropPress={close}
      animationType="fade"
    >
      <View
        style={{
          padding: 12,
          backgroundColor: theme['bg-secondary'],
          flexDirection: 'column',
          gap: 5,
          borderRadius: 16,
          flex: 1,
          minWidth: 300,
        }}
      >
        <View style={{ alignItems: 'center', position: 'relative' }}>
          <Text
            category="s1"
            style={{ textTransform: 'uppercase', fontWeight: '700' }}
          >
            {config.title}
          </Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={close}
          >
            <Feather name="x" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingVertical: 12 }}>
          {typeof config.content === 'string' ? (
            <Text>{config.content}</Text>
          ) : (
            config.content
          )}
        </View>

        {config.noAction ? null : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <Button
              status="primary"
              appearance="filled"
              style={{ flex: 1 }}
              onPress={() => {
                config.onSecondaryClick?.();
                close();
              }}
            >
              {config.secondaryButtonText || 'Ok'}
            </Button>
            <Button
              status="success"
              appearance="filled"
              style={{ flex: 1 }}
              onPress={() => {
                console.log('Primary button pressed, executing callback...');
                config.onPrimaryClick?.();
                // Add a small delay before closing to ensure navigation completes
                setTimeout(() => {
                  close();
                }, 100);
              }}
            >
              {config.primaryButtonText || 'Proceed'}
            </Button>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default NoticeDialog;
