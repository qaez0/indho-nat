import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from 'react-native';
import { useEffect, useRef } from 'react';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Datepicker,
  useTheme,
} from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBottomDrawer } from '../../hooks/useUIHelpers';
import BottomDrawer from '../../components/BottomDrawer';
import FormHelper from '../../components/FormHelper';
import { useFormHelper } from '../../hooks/useFormHelper';
import { profileModalFields } from '../../constants/profile';
import { useUser } from '../../hooks/useUser';
import { useProfile } from './useProfile';
import {
  addPhoneNumberSchema,
  updateProfileSchema,
  verifyEmailSchema,
  verifyPhoneNumberSchema,
} from '../../schemas/player';
import {
  UpdateProfileType,
  VerifyEmailType,
  VerifyPhoneNumberType,
} from '../../types/player';
import { useVerify } from '../../hooks/useVerify';
import { useCountdown } from '../../hooks/useCountDown';
import { useTranslation } from 'react-i18next';
import CountryFlag from '../../assets/common/flag.svg';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { secondsLeft, start, isRunning } = useCountdown(180);
  const theme = useTheme();
  const { user } = useUser();
  const { updateBasicInfo, isUpdatingBasicInfo } = useProfile();
  const { getOtpPhone, getOtpEmail, addNewPhone, loadingState } = useVerify();
  const openDialog = useBottomDrawer(state => state.openDialog);
  const config = useBottomDrawer(state => state.config);
  const closeDialog = useBottomDrawer(state => state.closeDialog);
  const { getForm } = useFormHelper();
  const isProcessingRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<View>(null);
  const containerRef = useRef<View>(null);

  // Handle Android back button to dismiss keyboard
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (Keyboard.isVisible()) {
          Keyboard.dismiss();
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, []);

  const alreadyHasBasic =
    user?.player_info.real_name !== '' &&
    user?.player_info.gender !== '' &&
    user?.player_info.birthday !== '';
  
  const hasRealName = user?.player_info.real_name?.trim() !== '';

  const mobileFieldForm = useForm<VerifyPhoneNumberType>({
    resolver:
      user?.player_info.phone === ''
        ? yupResolver(addPhoneNumberSchema)
        : yupResolver(verifyPhoneNumberSchema),
    defaultValues: {
      phone: user?.player_info.phone,
    },
  });
  const emailFieldForm = useForm<VerifyEmailType>({
    resolver: yupResolver(verifyEmailSchema),
    defaultValues: {
      email: user?.player_info.email,
    },
  });
  const updateProfileForm = useForm<UpdateProfileType>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      real_name: user?.player_info?.real_name?.trim() || '',
      gender:
        user?.player_info.gender?.toLowerCase() === 'male'
          ? t('profile.male')
          : user?.player_info.gender?.toLowerCase() === 'female'
          ? t('profile.female')
          : '',
      birthday: user?.player_info.birthday,
    },
  });

  // Handle real name input validation - defined after updateProfileForm
  const handleRealNameChange = (text: string) => {
    // Prevent processing if already processing to avoid loops
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    // Remove any invalid characters (only allow letters and spaces)
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    
    // Ensure only single spaces (replace multiple spaces with single space)
    const singleSpaceText = filteredText.replace(/\s+/g, ' ');
    
    // Prevent leading spaces - if user tries to start with space, remove it
    const noLeadingSpace = singleSpaceText.startsWith(' ') ? singleSpaceText.trim() : singleSpaceText;
    
    // Update the form value
    updateProfileForm.setValue('real_name', noLeadingSpace);
    
    // Reset processing flag
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 50);
  };

  const handlePhoneVerifyButton = (data: VerifyPhoneNumberType) => {
    const onSuccess = (phone: string) => {
      start();
      openDialog(
        profileModalFields(
          'verify-mobile',
          phone,
          {
            isLoading: loadingState.isPendingPhone,
            isRunning,
            secondsLeft,
            label: 'send code',
            onClick: () => {
              if (user?.player_info.phone) {
                getOtpPhone(
                  {
                    phone: user?.player_info.phone,
                  },
                  start,
                );
              } else {
                addNewPhone(
                  {
                    phone: `91${data.phone}`,
                  },
                  start,
                );
              }
            },
          },
          t,
        ),
      );
    };

    if (user?.player_info.phone === '') {
      addNewPhone(
        {
          phone: `91${data.phone}`,
        },
        () => onSuccess(`91${data.phone}`),
      );
      return;
    }

    if (user?.player_info.phone && !user.player_info.phone_validation) {
      getOtpPhone(
        {
          phone: data.phone || '',
        },
        () => onSuccess(data.phone),
      );
    }
  };

  const AccessoryLeftPhone = () => {
    if (user?.player_info.phone === '') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <CountryFlag width={24} height={24} />
          <Text style={{ color: 'white' }}>+91</Text>
        </View>
      );
    }
    return <View />;
  };

  const handleEmailFocus = () => {
    if (emailInputRef.current && containerRef.current && scrollViewRef.current) {
      // Use measureLayout to get position relative to the scrollable container
      emailInputRef.current.measureLayout(
        containerRef.current,
        (x, y) => {
          // Scroll to the email input position with some padding
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, y - 100), // Add padding from top, ensure non-negative
            animated: true,
          });
        },
        () => {
          // Fallback: retry after a short delay
          setTimeout(() => {
            emailInputRef.current?.measureLayout(
              containerRef.current!,
              (x, y) => {
                scrollViewRef.current?.scrollTo({
                  y: Math.max(0, y - 100),
                  animated: true,
                });
              },
              () => {},
            );
          }, 150);
        },
      );
    }
  };

  // Mutation handled inside useProfile

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior="padding" // ✅ force padding on both iOS and Android
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // ✅ adjusted offset
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled" // ✅ ensure taps go through
          keyboardDismissMode="on-drag" // ✅ dismiss on scroll
          showsVerticalScrollIndicator={false}
        >
          <View
            ref={containerRef}
            style={{
              ...styles.container,
              backgroundColor: theme['bg-secondary'],
            }}
          >
            <View style={styles.contentContainer}>
              {/* Basic Profile Section */}
              <View style={styles.section}>
                <Controller
                  control={updateProfileForm.control}
                  name="real_name"
                  render={({ field }) => (
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>{t('profile.real-name')}</Text>
                      <Input
                        placeholder={t('profile.real-name-placeholder')}
                        value={field.value}
                        onChangeText={handleRealNameChange}
                        disabled={hasRealName || alreadyHasBasic}
                        onBlur={() => {
                          const trimmedValue = field.value.trim();
                          if (trimmedValue !== field.value) {
                            updateProfileForm.setValue('real_name', trimmedValue);
                          }
                        }}
                      />
                      <Text style={{ display: 'none' }}>{field.value}</Text>
                    </View>
                  )}
                />

                <Controller
                  control={updateProfileForm.control}
                  name="gender"
                  render={({ field }) => (
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>{t('profile.gender')}</Text>
                      <Select
                        placeholder={t('profile.gender-placeholder')}
                        value={field.value}
                        onSelect={index => {
                          const options = [
                            t('profile.male'),
                            t('profile.female'),
                          ];
                          if (Array.isArray(index)) {
                            field.onChange(options[index[0].row]);
                          } else {
                            field.onChange(options[index.row]);
                          }
                        }}
                        disabled={alreadyHasBasic}
                      >
                        <SelectItem title={t('profile.male')} />
                        <SelectItem title={t('profile.female')} />
                      </Select>
                    </View>
                  )}
                />

                <Controller
                  control={updateProfileForm.control}
                  name="birthday"
                  render={({ field }) => {
                    const maxDate = new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18),
                    );
                    const selectedDate = parseDate(field.value);
                    return (
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>
                          {t('profile.birthday')}
                        </Text>
                        <Datepicker
                          placeholder={t('profile.birthday-placeholder')}
                          min={new Date('1900-01-01')}
                          max={maxDate}
                          date={selectedDate}
                          initialVisibleDate={selectedDate || maxDate}
                          onSelect={date => {
                            field.onChange(date.toISOString());
                          }}
                          disabled={alreadyHasBasic}
                          accessoryRight={() => (
                            <Feather
                              name="calendar"
                              size={16}
                              color="#666666"
                              style={{ marginRight: 8 }}
                            />
                          )}
                        />
                      </View>
                    );
                  }}
                />

                {!alreadyHasBasic && (
                  <Button
                    appearance="filled"
                    status="success"
                    style={styles.saveButton}
                    onPress={() => {
                      // Trim whitespace from real name before saving
                      const trimmedRealName = updateProfileForm.getValues('real_name').trim();
                      updateProfileForm.setValue('real_name', trimmedRealName);
                      
                      updateProfileForm.handleSubmit(data => {
                        updateBasicInfo(data);
                      })();
                    }}
                    disabled={isUpdatingBasicInfo}
                  >
                    {isUpdatingBasicInfo ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <ActivityIndicator size="small" color="black" />
                        <Text style={{ color: 'black' }}>
                          {t('profile.saving')}
                        </Text>
                      </View>
                    ) : (
                      t('profile.save')
                    )}
                  </Button>
                )}
              </View>

              {/* Mobile & Email Section */}
              <View style={styles.section}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t('profile.mobile-number')}</Text>
                  <View style={styles.rowContainer}>
                    <Controller
                      control={mobileFieldForm.control}
                      name="phone"
                      render={({ field }) => (
                        <Input
                          placeholder={t('profile.mobile-number-placeholder')}
                          maxLength={10}
                          keyboardType="numeric"
                          accessoryLeft={AccessoryLeftPhone}
                          value={field.value}
                          onChangeText={field.onChange}
                          disabled={
                            user?.player_info.phone_validation ||
                            user?.player_info.phone !== ''
                          }
                          style={{ flex: 1 }}
                          status={
                            mobileFieldForm.formState.errors.phone
                              ? 'danger'
                              : 'basic'
                          }
                          caption={
                            mobileFieldForm.formState.errors.phone?.message
                          }
                        />
                      )}
                    />
                    <Button
                      appearance="filled"
                      status="success"
                      disabled={user?.player_info.phone_validation}
                      style={{
                        height: '100%',
                      }}
                      onPress={mobileFieldForm.handleSubmit(
                        handlePhoneVerifyButton,
                      )}
                    >
                      {user?.player_info.phone === ''
                        ? 'Add'
                        : user?.player_info.phone_validation
                        ? t('profile.verified')
                        : t('profile.verify')}
                    </Button>
                  </View>
                </View>

                <View ref={emailInputRef} style={styles.formGroup}>
                  <Text style={styles.label}>{t('profile.email')}</Text>
                  <View style={styles.rowContainer}>
                    <Controller
                      control={emailFieldForm.control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          placeholder={t('profile.email-placeholder')}
                          value={field.value}
                          onChangeText={field.onChange}
                          onFocus={handleEmailFocus}
                          disabled={user?.player_info.email !== ''}
                          style={{ flex: 1 }}
                          status={
                            emailFieldForm.formState.errors.email
                              ? 'danger'
                              : 'basic'
                          }
                          caption={
                            emailFieldForm.formState.errors.email?.message
                          }
                        />
                      )}
                    />
                    <Button
                      appearance="filled"
                      status="success"
                      style={{
                        height: '100%',
                      }}
                      disabled={user?.player_info.email !== ''}
                      onPress={() => {
                        setTimeout(() => {
                          emailFieldForm.handleSubmit(data => {
                            getOtpEmail(
                              {
                                email: data.email,
                              },
                              () => {
                                start();
                                openDialog(
                                  profileModalFields(
                                    'verify-email',
                                    data.email,
                                    {
                                      isLoading: loadingState.isPendingEmail,
                                      isRunning,
                                      secondsLeft,
                                      label: 'send code',
                                      onClick: () => {
                                        if (!isRunning) {
                                          getOtpEmail(
                                            {
                                              email: data.email,
                                            },
                                            start,
                                          );
                                        }
                                      },
                                    },
                                    t,
                                  ),
                                );
                              },
                            );
                          })();
                        }, 100);
                      }}
                    >
                      {user?.player_info.email !== ''
                        ? t('profile.verified')
                        : t('profile.verify')}
                    </Button>
                  </View>
                </View>

                {/* Password Section */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    {t('profile.account-password')}
                  </Text>
                  <Button
                    appearance="filled"
                    status="success"
                    style={styles.saveButton}
                    onPress={() => {
                      openDialog(
                        profileModalFields(
                          'change-pass',
                          undefined,
                          undefined,
                          t,
                        ),
                      );
                      console.log('Change password');
                    }}
                  >
                    {t('profile.change-password')}
                  </Button>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    {t('profile.wallet-password')}
                  </Text>
                  <Button
                    appearance="filled"
                    status="success"
                    style={styles.saveButton}
                    disabled={user?.player_info.has_wallet_pass}
                    onPress={() => {
                      openDialog(
                        profileModalFields(
                          'set-wallet-pass',
                          undefined,
                          undefined,
                          t,
                        ),
                      );
                      console.log('Set wallet password');
                    }}
                  >
                    {t('profile.set-wallet-pass')}
                  </Button>
                </View>
              </View>
            </View>

            {config && (
              <BottomDrawer>
                <FormHelper
                  onClose={closeDialog}
                  {...config}
                  {...getForm(config?.form_id as keyof typeof getForm)}
                  countdownState={{
                    secondsLeft,
                    isRunning,
                    start,
                  }}
                />
              </BottomDrawer>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  pageTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  contentContainer: {
    gap: 24,
  },
  section: {
    padding: 20,
    borderRadius: 8,
    gap: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formGroup: {
    gap: 8,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  flex1: {
    flex: 1,
  },
  saveButton: {
    minHeight: 40,
  },
  verifyButton: {
    minWidth: 80,
  },
});

const parseDate = (value?: string) => {
  if (!value) return undefined;
  const isoValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00.000Z`
    : value;
  const d = new Date(isoValue);
  return isNaN(d.getTime()) ? undefined : d;
};
