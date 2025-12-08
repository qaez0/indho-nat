import { useState, useEffect, useRef } from 'react';
import { TG_BOT_NAME } from '@env';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
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
import type { IBaseResponse } from '../../types/api';
import {
  appsFlyer,
  loginPlayer,
  registerPlayer,
  ssoLogin,
  telegramLogin,
} from '../../services/auth.service';
import TelegramWebView from './component/TelegramWebView';
import type {
  IRegisterPlayer,
  ILoginResponse,
  ISsoLoginPayload,
  ITelegramLoginPayload,
} from '../../types/auth';
import { registerSchema } from '../../schemas/auth';
import Toast from 'react-native-toast-message';
import { AuthParamList, RootStackNav } from '../../types/nav';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useUserStore } from '../../store/useUser';
import { getBasicDeviceInfo } from '../../services/device.service';
import { IDevice } from '../../types/device';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { PasswordIcon, InviteIcon } from '../../components/icons/SvgIcons';
export default function RegisterScreen() {
  const [telegramWebViewOpen, setTelegramWebViewOpen] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNav>();
  const theme = useTheme();
  const setToken = useUserStore(state => state.setToken);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const adjust_id = useUserStore(state => state.adjust_id);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const route = useRoute<RouteProp<AuthParamList, 'register'>>();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        // Phase 1: Scale up image + build glow
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
        // Phase 2: Scale down image + fade glow
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
      ]),
    ).start();
  }, [pulseAnim, glowAnim]);

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

  const renderIcon = (props: any) => (
    <TouchableOpacity onPress={toggleSecureEntry}>
      <FontAwesome6
        name={secureTextEntry ? 'eye-slash' : 'eye'}
        size={16}
        color={theme['text-hint-color']}
      />
    </TouchableOpacity>
  );
  const { mutateAsync: mutateSso, isPending: isSsoPending } = useMutation({
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

  const handleSocial = (provider: 'whatsapp' | 'facebook') => {
    if (provider === 'whatsapp') {
      Toast.show({
        type: 'error',
        text1:
          'Sorry for the inconvenience, WhatsApp login is not available yet!',
      });
    } else if (provider === 'facebook') {
      Toast.show({
        type: 'error',
        text1:
          'Sorry for the inconvenience, Facebook login is not available yet!',
      });
    }
  };
  const handleGoogleSSO = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response?.type === 'cancelled') {
        Toast.show({
          type: 'error',
          text1: 'Google login cancelled',
        });
        return;
      }
      const deviceInfo = await getBasicDeviceInfo();
      const payload: ISsoLoginPayload = {
        provider: 'google',
        sso_id: response?.data?.user?.id ?? '',
        email: response?.data?.user?.email ?? '',
        name: response?.data?.user?.name ?? 'Unknown',
        avatar: response?.data?.user?.photo ?? undefined,
        access_token: response?.data?.idToken ?? '',
        raw_provider_data: response?.data,
        ...deviceInfo,
      };
      console.log('GOOGLE DATA', response);
      mutateSso(payload);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Google login failed',
        text2: 'An unexpected error occurred.',
      });
    }
  };

  // Form setup
  const form = useForm<IRegisterPlayer>({
    resolver: yupResolver(registerSchema, {
      abortEarly: false, // Show all validation errors together
    }),
    defaultValues: {
      phone: '',
      password: '',
      invitation_code: route.params?.invite_code || 'jX3Ts33',
      agreement: false,
    },
    mode: 'onChange',
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['Register'],
    mutationFn: async (data: IRegisterPlayer & IDevice) => {
      const payload = {
        ...data,
        phone: `92${data.phone}`,
        agent_code: 'jX3Ts33',
      };
      const response = await registerPlayer(payload, adjust_id);
      if (typeof response.data === 'boolean' || response.data === null) {
        throw new Error(response?.message);
      }
      return response.data;
    },
    onSuccess: async (result, variables) => {
      appsFlyer({
        player_id: result.player_id,
        event_name: 'af_complete_registration',
      });
      const payload = {
        ...variables,
        phone: `92${variables.phone}`,
      };
      Toast.show({
        type: 'success',
        text1: 'Registration successful!',
      });
      try {
        const loginResponse = await loginPlayer(payload, 'phone', adjust_id);
        if (loginResponse?.message === 'LOGIN FAILED') {
          throw new Error(
            `Having trouble signing you in, please contact customer support`,
          );
        }
        if (
          typeof loginResponse.data === 'boolean' &&
          loginResponse.data === false
        ) {
          throw new Error(`Failed to login: ${loginResponse.message}}`);
        }
        appsFlyer({
          player_id: result.player_id,
          event_name: 'af_login',
        });
        const token = {
          auth_token: loginResponse?.data,
          refresh_token: loginResponse?.refresh,
          refresh_expiry: loginResponse?.refresh_expiry,
          auth_expiry: loginResponse?.expiry,
        };
        setToken(token);
        navigation.navigate('main-tabs', {
          screen: 'tabs',
          params: {
            screen: 'slots',
            params: {
              game_id: undefined,
            },
          },
        });
        form.reset();
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Login failed!',
          text2: error?.message,
        });
      }
    },
    onError: (error: any) => {
      console.log('ERRORRRRR', error);
      Toast.show({
        type: 'error',
        text1: error?.message,
      });
    },
  });

  const onSubmit = async (data: IRegisterPlayer) => {
    const deviceInfo = await getBasicDeviceInfo();
    const payload = {
      ...data,
      ...deviceInfo,
    };
    console.log(payload);
    mutateAsync(payload);
  };

  const handleFormSubmit = () => {
    form.handleSubmit(onSubmit, err => {
      console.error(err);
    })();
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
              uri: 'https://imagedelivery.net/SViyH5iSEWrJ3_F3ZK6HYg/11ic_register_mb/public',
            }}
          />
          <View style={styles.titleContainer}>
            <Text category="h4" style={[styles.title]}>
              {t('register-screen.title')}
            </Text>
          </View>

          {/* Welcome Bonus Section (hidden) */}
          <View style={[styles.welcomeBonusWrapper, { display: 'none' }]}>
            {/* Recreate the exact CSS box-shadow glow effect */}
            <Animated.View
              style={[
                styles.welcomeBonusContainer,
                { backgroundColor: '#232323' },
                {
                  borderRadius: 14, // Ensure border radius is applied to the animated view
                  shadowColor: '#FFFF00', // Yellow glow like CSS
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: glowAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.8, 0], // Higher opacity for stronger border glow
                  }),
                  shadowRadius: glowAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 8, 0], // Smaller radius to keep glow closer to border
                  }),
                  elevation: glowAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 8, 0], // Reduced elevation for subtle effect
                  }),
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.giftIconContainer,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Image
                  source={require('../../assets/drawer/bonus.png')}
                  style={styles.giftIcon}
                  resizeMode="contain"
                />
              </Animated.View>
              <View style={styles.bonusTextContainer}>
                <Text category="h6" style={[styles.bonusText, styles.fontText]}>
                  {t('register-screen.welcome-bonus')}
                </Text>
              </View>
            </Animated.View>
          </View>

          <View style={styles.formContainer}>
            <Controller
              name="phone"
              control={form.control}
              render={({ field: { onChange, onBlur, value }, fieldState }) => {
                // Get all errors for phone field
                const phoneErrors = form.formState.errors.phone;
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
                      } else if (
                        yupMessage === 'Invalid Mobile Number Format'
                      ) {
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
                      placeholder={t('register-screen.placeholder.phone')}
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
                          }}
                        >
                          <Text style={styles.fontText}>+92</Text>
                        </View>
                      )}
                      status={form.formState.errors.phone ? 'danger' : 'basic'}
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
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => {
                const passwordError = form.formState.errors.password;
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
                      placeholder={t('register-screen.placeholder.password')}
                      value={value}
                      onChangeText={text =>
                        handlePasswordChange(text, onChange)
                      }
                      secureTextEntry={secureTextEntry}
                      onBlur={onBlur}
                      accessoryLeft={() => (
                        <PasswordIcon width={16} height={16} />
                      )}
                      accessoryRight={renderIcon}
                      status={
                        form.formState.errors.password ? 'danger' : 'basic'
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
              name="invitation_code"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => {
                const invitationError = form.formState.errors.invitation_code;
                let errorMessage = '';

                if (invitationError?.message) {
                  // Translate Yup error messages
                  const yupMessage = invitationError.message;
                  if (yupMessage === 'Password cannot contain spaces') {
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
                      placeholder={t(
                        'register-screen.placeholder.invitation-code',
                      )}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      accessoryLeft={() => (
                        <InviteIcon width={16} height={16} />
                      )}
                      status={
                        form.formState.errors.invitation_code
                          ? 'danger'
                          : 'basic'
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

          <View
            style={{
              flexDirection: 'column',
              gap: 15,
              width: '100%',
            }}
          >
            {/* Agreement Checkbox */}
            <View style={styles.agreementContainer}>
              <Controller
                name="agreement"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <CheckBox checked={value} onChange={onChange} />
                )}
              />
              <Text category="c1" style={styles.agreementTextWhite}>
                {t('register-screen.agreement')}{' '}
                <Text category="c1" style={styles.agreementTextHighlight}>
                  {t('register-screen.agreement-2')}
                </Text>{' '}
                {t('register-screen.agreement-3')}{' '}
                <Text category="c1" style={styles.agreementTextHighlight}>
                  {t('register-screen.agreement-4')}{' '}
                </Text>
                <Text category="c1" style={styles.agreementTextWhite}>
                  {t('register-screen.agreement-5')}{' '}
                </Text>
              </Text>
            </View>

            <View style={styles.registerButtonContainer}>
              <Button
                style={{
                  width: '100%',
                  height: 42,
                }}
                onPress={handleFormSubmit}
                accessoryLeft={
                  isPending ? () => <Spinner size="small" /> : undefined
                }
                appearance="filled"
                status="success"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending
                  ? t('register-screen.registering')
                  : t('register-screen.confirm-registration')}
              </Button>
            </View>
          </View>
          {/* <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: '#7F8487' }]} />
            <Text category="p2" style={styles.fontTextWhite}>
              {' '}
              {t('login-screen.or-create-an-account')}
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

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text category="c1" style={styles.alreadyHaveAccountText}>
              {t('register-screen.already-have-an-account')}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('auth', {
                  screen: 'login',
                })
              }
            >
              <Text category="c1" style={styles.loginText}>
                {t('register-screen.login')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TelegramWebView
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
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fontText: {
    marginLeft: 5,
    fontFamily: 'Afacad',
    fontSize: 14,
    color: '#000000',
  },
  fontTextWhite: {
    marginLeft: 5,
    fontFamily: 'Afacad',
    fontSize: 14,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 42,
    zIndex: 1,
    marginBottom: 15, // No margin, error container will handle spacing
  },
  errorContainer: {
    marginTop: -20, // Space between input field and error messages
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
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Extra padding at bottom for scrolling
  },
  mainContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 10,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  welcomeBonusWrapper: {
    position: 'relative',
    width: '100%',
  },
  welcomeBonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 15,
    width: '100%',
    // Add shadow properties for the glow effect
    shadowColor: '#FFFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  giftIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftIcon: {
    width: 32,
    height: 32,
    zIndex: 1,
  },
  bonusTextContainer: {
    alignItems: 'center',
  },
  bonusText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
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
  formContainer: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    paddingBottom: 8, // Extra padding for error messages
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  agreementText: {
    flex: 1,
    lineHeight: 15,
  },
  agreementTextWhite: {
    marginLeft: 5,
    fontFamily: 'Afacad',
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 15,
  },
  agreementTextHighlight: {
    marginLeft: 5,
    fontFamily: 'Afacad',
    fontSize: 14,
    color: '#F3B867',
    lineHeight: 15,
  },
  registerButtonContainer: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    width: '100%',
  },
  alreadyHaveAccountText: {
    marginLeft: 5,
    fontFamily: 'Afacad',
    fontSize: 14,
    color: '#FFFFFF',
  },
  loginText: {
    marginLeft: 5,
    fontFamily: 'Afacad',
    fontSize: 14,
    color: '#F3B867',
  },
  bannerDrawer: {
    height: 145,
    width: '96%',
    borderRadius: 14,
    objectFit: 'cover',
    alignSelf: 'center',
  },
});
