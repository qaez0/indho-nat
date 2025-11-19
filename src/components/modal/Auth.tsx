import { Modal, Text, Button } from '@ui-kitten/components';
import { useAuthModal } from '../../store/useUIStore';
import { View } from 'react-native';
import { RootStackNav, TabNav } from '../../types/nav';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const AuthModal = () => {
  const { t } = useTranslation();
  const open = useAuthModal(state => state.open);
  const navigation = useNavigation<RootStackNav>();
  const closeDialog = useAuthModal(state => state.closeDialog);

  const handleLogin = () => {
    closeDialog();
    navigation.navigate('auth', {
      screen: 'login',
    });
  };

  const handleRegister = () => {
    closeDialog();
    navigation.navigate('auth', {
      screen: 'register',
      params: {
        invite_code: undefined,
      },
    });
  };

  return (
    <Modal
      visible={open}
      animationType="fade"
      backdropStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onBackdropPress={closeDialog}
    >
      <View
        style={{
          backgroundColor: '#171717',
          borderRadius: 20,
          minWidth: 360,
          padding: 0,
        }}
      >
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 0,
          }}
        >
          <Text
            category="h4"
            style={{
              textAlign: 'left',
              fontSize: 26,
              fontWeight: '700',
              color: '#fff',
              paddingBottom: 0,
              paddingTop: 12,
            }}
          >
            {t('auth-modal.attention')}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 4,
            paddingBottom: 0,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: '400',
              marginBottom: 16,
            }}
          >
            {t('auth-modal.login-or-register-message')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingBottom: 24,
            paddingTop: 4,
            paddingHorizontal: 24,
          }}
        >
          <Button
            onPress={handleLogin}
            style={{
              backgroundColor: '#363735',
              borderColor: '#f3b867',
              borderWidth: 1,
              borderRadius: 12,
              minWidth: 120,
              paddingHorizontal: 20,
              paddingVertical: 6,
              marginRight: 8,
            }}
            appearance="ghost"
          >
            {() => (
              <Text
                style={{
                  color: '#f3b867',
                  fontWeight: '700',
                  fontSize: 14,
                }}
              >
                {t('common-terms.login')}
              </Text>
            )}
          </Button>

          <Button
            onPress={handleRegister}
            style={{
              backgroundColor: '#f3b867',
              borderColor: 'transparent',
              borderRadius: 12,
              minWidth: 120,
              paddingHorizontal: 20,
              paddingVertical: 6,
              marginLeft: 8,
            }}
            appearance="filled"
          >
            {() => (
              <Text
                style={{
                  color: '#000',
                  fontWeight: '700',
                  fontSize: 14,
                }}
              >
                {t('common-terms.register')}
              </Text>
            )}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default AuthModal;
