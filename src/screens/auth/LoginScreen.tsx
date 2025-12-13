import { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import {
  Button,
  useTheme,
  Input,
  Text,
  Spinner,
  CheckBox,
} from '@ui-kitten/components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import {
  appsFlyer,
  loginPlayer,
  ssoLogin,
  telegramLogin,
} from '../../services/auth.service';
import { useUserStore } from '../../store/useUser';
import type {
  ILoginPhoneLogin,
  ILoginUsernameLogin,
  ILoginResponse,
  ISsoLoginPayload,
  ITelegramLoginPayload,
} from '../../types/auth';
import type { IBaseResponse } from '../../types/api';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {
  UserIcon,
  PhoneIcon,
  PasswordIcon,
} from '../../components/icons/SvgIcons';
import { phoneLoginSchema, usernameLoginSchema } from '../../schemas/auth';
import Toast from 'react-native-toast-message';
import { RootStackNav } from '../../types/nav';
import { useNavigation } from '@react-navigation/native';
import { IDevice } from '../../types/device';
import { getBasicDeviceInfo } from '../../services/device.service';
import ForgotPassDialog from './component/ForgotPassDialog';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

export default function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNav>();
  const theme = useTheme();
  const setToken = useUserStore(state => state.setToken);
  const [loginType, setLoginType] = useState<'username' | 'phone'>('phone');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const adjust_id = useUserStore(state => state.adjust_id);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handlePhoneChange = (
    text: string,
    onChange: (value: string) => void,
  ) => {
    // Filter out non-numeric characters immediately
    const numericOnly = text.replace(/[^0-9]/g, '');
    // Only update if the filtered value is different from what user typed
    // This prevents invalid characters from appearing
    onChange(numericOnly);
  };

  const handlePasswordChange = (
    text: string,
    onChange: (value: string) => void,
  ) => {
    // Filter out spaces immediately
    const noSpaces = text.replace(/\s/g, '');
    // Only update if the filtered value is different from what user typed
    // This prevents spaces from appearing
    onChange(noSpaces);
  };

  const renderIcon = (_props: any) => (
    <TouchableOpacity onPress={toggleSecureEntry}>
      <FontAwesome6
        name={secureTextEntry ? 'eye-slash' : 'eye'}
        size={16}
        color={'#000000'}
      />
    </TouchableOpacity>
  );

  // Form setup
  const formPhone = useForm<ILoginPhoneLogin>({
    resolver: yupResolver(phoneLoginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
    mode: 'onChange',
  });

  const formUsername = useForm<ILoginUsernameLogin>({
    resolver: yupResolver(usernameLoginSchema),
    defaultValues: {
      player_id: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['Login'],
    mutationFn: async (
      data: (ILoginPhoneLogin | ILoginUsernameLogin) & IDevice,
    ) => {
      Toast.show({
        type: 'promise',
        text1: t('common-terms.logging-in'),
        autoHide: false,
      });
      const response = await loginPlayer(data, loginType, adjust_id);
      return response;
    },
    onSuccess: (response: IBaseResponse<string> & ILoginResponse, payload) => {
      Toast.hide();
      if (response?.message === 'LOGIN FAILED') {
        throw new Error(
          `Invalid credentials, ${loginType} or password is incorrect`,
        );
      }
      if (typeof response.data === 'boolean' && response.data === false) {
        throw new Error(`Failed to login: ${response.message}}`);
      }
      if ('player_id' in payload) {
        appsFlyer({
          player_id: payload.player_id,
          event_name: 'af_login',
        });
      }
      const token = {
        auth_token: response?.data,
        refresh_token: response?.refresh,
        refresh_expiry: response?.refresh_expiry,
        auth_expiry: response?.expiry,
      };
      setToken(token);
      navigation.navigate('main-tabs', {
        screen: 'tabs',
        params: {
          screen: 'home',
        },
      });
      formPhone.reset();
      formUsername.reset();
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Login failed!',
        text2: error?.message,
      });
    },
  });

  const { isPending: isSsoPending } = useMutation({
    mutationKey: ['ssoLogin'],
    mutationFn: async (
      payload: (ISsoLoginPayload | ITelegramLoginPayload) & IDevice,
    ) => {
      Toast.show({
        type: 'promise',
        text1: t('common-terms.logging-in'),
      });
      let response;
      if ('provider' in payload) {
        response = await ssoLogin(payload, adjust_id);
      } else {
        response = await telegramLogin(payload, adjust_id);
      }
      return response;
    },
    onSuccess: (response: IBaseResponse<string> & ILoginResponse) => {
      console.log('--- SSO/Telegram Login Success ---');
      console.log('Response:', JSON.stringify(response, null, 2));
      if (response?.message === 'LOGIN FAILED') {
        throw new Error('SSO Login failed, please try again');
      }
      if (typeof response.data === 'boolean' && response.data === false) {
        throw new Error(`Failed to login: ${response.message}}`);
      }
      Toast.hide();
      const token = {
        auth_token: response?.data,
        refresh_token: response?.refresh,
        refresh_expiry: response?.refresh_expiry,
        auth_expiry: response?.expiry,
      };
      setToken(token);
      navigation.navigate('main-tabs', {
        screen: 'tabs',
        params: {
          screen: 'home',
        },
      });
    },
    onError: (error: any) => {
      Toast.hide();
      console.log('--- SSO/Telegram Login Error ---');
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Login failed!',
        text2: error?.message,
      });
    },
  });

  const onSubmit = async (data: ILoginPhoneLogin | ILoginUsernameLogin) => {
    const deviceInfo = await getBasicDeviceInfo();
    const payload = {
      ...data,
      ...('phone' in data && { phone: `92${data.phone}` }),
      ...deviceInfo,
    };
    mutateAsync(payload);
  };

  const handleFormSubmit = () => {
    if (loginType === 'phone') {
      formPhone.handleSubmit(onSubmit, err => {
        console.error(err);
      })();
    } else {
      formUsername.handleSubmit(onSubmit, err => {
        console.error(err);
      })();
    }
  };

  const formFields = {
    phone: (
      <View style={styles.formContainer}>
        <Controller
          name="phone"
          control={formPhone.control}
          render={({ field: { onChange, onBlur, value } }) => {
            const phoneErrors = formPhone.formState.errors.phone;
            let errorMessage = '';

            if (phoneErrors) {
              // Translate Yup error messages first
              const yupMessage = phoneErrors.message || '';

              // Check if it's a required error
              if (
                !value ||
                yupMessage === 'Phone number is required' ||
                yupMessage.includes('required')
              ) {
                errorMessage = t('auth.phone-number-is-required');
              } else {
                // Check if we have multiple error types
                const errors: string[] = [];

                // Check for prefix error first
                const hasPrefixError =
                  value &&
                  (value.startsWith('0') ||
                    value.startsWith('92') ||
                    value.startsWith('+92'));

                if (hasPrefixError) {
                  // When prefix error occurs, show both errors
                  errors.push(t('auth.invalid-mobile-number-format'));
                  errors.push(t('auth.do-not-add-prefix'));
                } else {
                  // Check for format error only if no prefix error
                  if (value && !/^\d{10}$/.test(value)) {
                    errors.push(t('auth.invalid-mobile-number-format'));
                    errors.push(t('auth.do-not-add-prefix'));
                  }
                }

                // Combine errors with newline
                if (errors.length > 0) {
                  errorMessage = errors.join('\n');
                } else {
                  // Translate other Yup error messages
                  if (yupMessage === 'Mobile number must be 10 digits') {
                    errorMessage = t('auth.phone-number-must-be-10-digits');
                  } else if (yupMessage === 'Invalid Mobile Number Format') {
                    errorMessage = t('auth.invalid-mobile-number-format');
                  } else if (
                    yupMessage ===
                    'Do not add 0, +92, or 92 at the start of the number.'
                  ) {
                    errorMessage = t('auth.do-not-add-prefix');
                  } else {
                    errorMessage = yupMessage;
                  }
                }
              }
            }

            return (
              <View>
                <Input
                  style={styles.input}
                  textStyle={styles.inputText}
                  placeholder={t('login-screen.placeholder.phone')}
                  value={value}
                  onChangeText={text => handlePhoneChange(text, onChange)}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  maxLength={10}
                  accessoryLeft={() => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        marginLeft: 5,
                      }}
                    >
                      <Text style={styles.inputPrefixText}>+92</Text>
                    </View>
                  )}
                  status={formPhone.formState.errors.phone ? 'danger' : 'basic'}
                />
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    {errorMessage.split('\n').map((error, index) => (
                      <Text key={index} style={styles.errorText}>
                        {error}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          }}
        />

        <Controller
          name="password"
          control={formPhone.control}
          render={({ field: { onChange, onBlur, value } }) => {
            const passwordError = formPhone.formState.errors.password;
            let errorMessage = '';

            if (passwordError?.message) {
              // Translate Yup error messages
              const yupMessage = passwordError.message;
              if (yupMessage === 'Password is required') {
                errorMessage = t('auth.password-is-required');
              } else if (yupMessage === 'Password cannot contain spaces') {
                errorMessage = t('auth.password-cannot-contain-spaces');
              } else {
                errorMessage = yupMessage;
              }
            }

            return (
              <View>
                <Input
                  style={styles.input}
                  textStyle={styles.inputText}
                  placeholder={t('login-screen.placeholder.password')}
                  value={value}
                  onChangeText={text => handlePasswordChange(text, onChange)}
                  secureTextEntry={secureTextEntry}
                  onBlur={onBlur}
                  accessoryLeft={() => <PasswordIcon width={16} height={16} />}
                  accessoryRight={renderIcon}
                  status={
                    formPhone.formState.errors.password ? 'danger' : 'basic'
                  }
                />
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}
              </View>
            );
          }}
        />
      </View>
    ),
    username: (
      <View style={styles.formContainer}>
        <Controller
          name="player_id"
          control={formUsername.control}
          render={({ field: { onChange, onBlur, value } }) => {
            const usernameError = formUsername.formState.errors.player_id;
            let errorMessage = '';

            if (usernameError?.message) {
              // Translate Yup error messages
              const yupMessage = usernameError.message;
              if (yupMessage === 'Username is required') {
                errorMessage = t('auth.username-is-required');
              } else if (yupMessage === 'Username too short') {
                errorMessage = t('auth.username-too-short');
              } else if (yupMessage === 'Username cannot contain spaces') {
                errorMessage = t('auth.username-cannot-contain-spaces');
              } else {
                errorMessage = yupMessage;
              }
            }

            return (
              <View>
                <Input
                  style={styles.input}
                  textStyle={styles.inputText}
                  placeholder={t('login-screen.placeholder.username')}
                  value={value}
                  onChangeText={e => {
                    const textWithoutSpaces = e.replace(/\s/g, '');
                    onChange(textWithoutSpaces);
                  }}
                  onBlur={onBlur}
                  accessoryLeft={() => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        marginLeft: 5,
                      }}
                    >
                      <Text style={styles.inputPrefixText}>ID</Text>
                    </View>
                  )}
                  status={
                    formUsername.formState.errors.player_id ? 'danger' : 'basic'
                  }
                />
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}
              </View>
            );
          }}
        />

        <Controller
          name="password"
          control={formUsername.control}
          render={({ field: { onChange, onBlur, value } }) => {
            const passwordError = formUsername.formState.errors.password;
            let errorMessage = '';

            if (passwordError?.message) {
              // Translate Yup error messages
              const yupMessage = passwordError.message;
              if (yupMessage === 'Password is required') {
                errorMessage = t('auth.password-is-required');
              } else if (yupMessage === 'Password cannot contain spaces') {
                errorMessage = t('auth.password-cannot-contain-spaces');
              } else {
                errorMessage = yupMessage;
              }
            }

            return (
              <View>
                <Input
                  style={styles.input}
                  textStyle={styles.inputText}
                  placeholder={t('login-screen.placeholder.password')}
                  value={value}
                  onChangeText={text => handlePasswordChange(text, onChange)}
                  onBlur={onBlur}
                  secureTextEntry={secureTextEntry}
                  accessoryLeft={() => <PasswordIcon width={16} height={16} />}
                  accessoryRight={renderIcon}
                  status={
                    formUsername.formState.errors.password ? 'danger' : 'basic'
                  }
                />
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}
              </View>
            );
          }}
        />
      </View>
    ),
  };

  return (
    <LinearGradient
      colors={['#000000', '#447916']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.mainContainer}>
          <Image
            style={styles.bannerDrawer}
            source={{
              uri:
                loginType === 'username'
                  ? 'https://imagedelivery.net/SViyH5iSEWrJ3_F3ZK6HYg/login_banner_mb/pc/public'
                  : 'https://imagedelivery.net/SViyH5iSEWrJ3_F3ZK6HYg/11ic_login_phone_mb/public',
            }}
          />

          <View style={styles.toggleContainer}>
            <Button
              style={styles.toggleButton}
              onPress={() => setLoginType('phone')}
              status={loginType === 'phone' ? 'success' : 'primary'}
              accessoryLeft={_props => (
                <PhoneIcon
                  width={16}
                  height={16}
                  color={
                    loginType === 'phone'
                      ? theme['color-basic-800']
                      : theme['color-basic-100']
                  }
                />
              )}
            >
              {t('login-screen.phone-number')}
            </Button>
            <Button
              style={styles.toggleButton}
              onPress={() => setLoginType('username')}
              appearance="filled"
              status={loginType === 'username' ? 'success' : 'primary'}
              accessoryLeft={_props => (
                <UserIcon
                  width={16}
                  height={16}
                  color={
                    loginType === 'username'
                      ? theme['color-basic-800']
                      : theme['color-basic-100']
                  }
                />
              )}
            >
              {t('login-screen.user-id')}
            </Button>
          </View>

          <View key={loginType} style={{ width: '100%' }}>
            {formFields[loginType]}
          </View>

          <View style={styles.forgotPasswordContainer}>
            <View style={styles.rememberContainer}>
              <CheckBox
                checked={rememberMe}
                onChange={setRememberMe}
                status="control"
                style={{ borderColor: '#FFFFFF' }}
              >
                <Text
                  category="c1"
                  style={[styles.fontText, { color: '#FFFFFF' }]}
                >
                  {' '}
                  {t('login-screen.remember-me')}
                </Text>
              </CheckBox>
            </View>
            <TouchableOpacity
              style={styles.forgotRow}
              onPress={() => setForgotPasswordOpen(true)}
            >
              <Text
                category="c1"
                style={[styles.fontText, styles.fontTextindia, styles.paddings]}
              >
                {' '}
                {t('login-screen.forgot-password')}
              </Text>
              {/* <View
                style={[styles.questionMark, { backgroundColor: '#F3B876' }]}
              > */}
              <Text
                category="c1"
                style={[styles.fontText, styles.fontTextindia]}
              >
                ?
              </Text>
              {/* </View> */}
            </TouchableOpacity>
          </View>
          <View style={styles.loginButtonContainer}>
            <Button
              style={{
                width: '100%',
                height: 46,
              }}
              onPress={handleFormSubmit}
              accessoryLeft={
                isPending || isSsoPending
                  ? () => <Spinner size="small" />
                  : undefined
              }
              appearance="filled"
              status="success"
              disabled={
                isPending ||
                isSsoPending ||
                !(loginType === 'phone'
                  ? formPhone.formState.isValid
                  : formUsername.formState.isValid)
              }
            >
              {isPending || isSsoPending
                ? t('login-screen.logging-in')
                : t('login-screen.login')}
            </Button>
          </View>

          {/* 

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: '#7F8487' }]} />
            <Text category="p2" style={styles.fontText}>
              {' '}
              {t('login-screen.or-continue-with')}
            </Text>
            <View style={[styles.divider, { backgroundColor: '#7F8487' }]} />
          </View>

          <View style={styles.socialContainer}>
            <View style={styles.socialButtonsContainer}>
              <Button
                style={styles.socialButton}
                onPress={() => setTelegramWebViewOpen(true)}
                accessoryLeft={() => (
                  <TelegramIcon width={26} height={26}></TelegramIcon>
                )}
              />
              <Button
                style={styles.socialButton}
                onPress={handleGoogleSSO}
                accessoryLeft={() => (
                  <GoogleIcon width={26} height={26}></GoogleIcon>
                )}
              />         
              <Button
                style={styles.socialButton}
                onPress={() => handleSocial('facebook')}
                accessoryLeft={() => (
                  <FacebookIcon width={26} height={26}></FacebookIcon>
                )}
              />
              <Button
                style={styles.socialButton}
                onPress={() => handleSocial('whatsapp')}
                accessoryLeft={() => (
                  <WhatsAppIcon width={26} height={26}></WhatsAppIcon>
                )}
              />
            </View>
          </View> */}

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text category="c1" style={styles.fontText}>
              {' '}
              {t('login-screen.dont-have-an-account')}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('auth', {
                  screen: 'register',
                  params: { invite_code: undefined },
                })
              }
            >
              <Text
                category="c1"
                style={[{ color: theme['color-success-500'] }, styles.fontText]}
              >
                {t('login-screen.register-account')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ForgotPassDialog
          open={forgotPasswordOpen}
          setOpen={setForgotPasswordOpen}
        />
        {/* <TelegramWebView
          visible={telegramWebViewOpen}
          onClose={() => setTelegramWebViewOpen(false)}
          onSuccess={async telegramData => {
            Toast.show({
              type: 'success',
              text1: 'Telegram authentication successful!',
              text2: 'Processing your login...',
            });
            const deviceInfo = await getBasicDeviceInfo();
            const payload: ITelegramLoginPayload = {
              bot_name: TG_BOT_NAME,
              ...telegramData,
              ...deviceInfo,
            };
            mutateSso(payload);
            console.log('TELEGRAM DATA', payload);
          }}
        /> */}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fontText: {
    fontFamily: 'Afacad',
  },
  fontTextindia: {
    color: '#F3b876',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 20,
    gap: 10,
    alignSelf: 'center',
    width: '100%',
  },
  bannerContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    maxWidth: 500,
  },
  bannerImage: {
    width: '100%',
    height: 250,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: '100%',
  },
  toggleButton: {
    flex: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  loginButtonContainer: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
    width: '100%',
    position: 'relative',
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 1,
    textAlign: 'center',
  },
  socialContainer: {
    gap: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  socialButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 1,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paddings: {
    paddingRight: 2,
  },
  questionMark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionMarkText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    width: '100%',
  },
  noAccountText: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 1,
    textAlign: 'center',
  },
  registerLink: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 1,
    textAlign: 'center',
  },
  formContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  bannerDrawer: {
    marginTop: 20,
    height: 150,
    width: '100%',
    borderRadius: 14,
    objectFit: 'cover',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 42,
    zIndex: 1,
    marginBottom: 15,
  },
  errorContainer: {
    marginTop: -20,
    marginBottom: 2,
    paddingTop: 20,
    paddingLeft: 20,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  errorText: {
    color: '#FF3D71',
    fontSize: 12,
    fontFamily: 'Afacad',
    lineHeight: 18,
    marginBottom: 2,
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'Afacad',
    height: 42,
    color: '#000000',
  },
  inputPrefixText: {
    color: '#000000',
  },
});
