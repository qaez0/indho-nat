import { Fragment, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Modal,
  Button,
  Text,
  Input,
  Tab,
  TabView,
  useTheme,
} from '@ui-kitten/components';
import InputWithOtp from '../../../components/InputWithOtp';
import Feather from '@react-native-vector-icons/feather';
import {
  forgotEmailSchema,
  forgotSmsSchema,
  resetPasswordSchema,
} from '../../../schemas/auth';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import type {
  IForgotEmail,
  IForgotSms,
  IResetPassword,
  IResetPasswordEmail,
  IResetPasswordSms,
} from '../../../types/auth';
import { useMutation } from '@tanstack/react-query';
import {
  forgotEmailRequest,
  resetPasswordEmail,
  resetPasswordSms,
  forgotSmsRequest,
} from '../../../services/auth.service';
import Toast from 'react-native-toast-message';
import type { IBaseResponse } from '../../../types/api';
import { MailIcon } from '../../../components/icons/SvgIcons';
import toastConfig from '../../../components/toast';
import { useCountdown } from '../../../hooks/useCountDown';

interface ForgotDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function ForgotPassDialog({ open, setOpen }: ForgotDialogProps) {
  const { t } = useTranslation();
  const { isRunning, start, secondsLeft } = useCountdown(180);
  const theme = useTheme();
  const [selectedRecovery, setSelectedRecovery] = useState<'sms' | 'email'>(
    'sms',
  );
  const [requestSuccededAlready, setRequestSuccededAlready] = useState(false);

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

  const handleClose = () => {
    setRequestSuccededAlready(false);
    smsForm.reset();
    emailForm.reset();
    setOpen(false);
  };

  const { mutateAsync: requestCode, isPending } = useMutation({
    mutationFn: async (data: IForgotSms | IForgotEmail) => {
      const errorMessage = [
        'request failed',
        "account or email doesn't exist",
        'phone is not validated, please contact customer service',
      ];
      if (selectedRecovery === 'sms') {
        const smsData = data as IForgotSms;
        const payload: IForgotSms = {
          ...smsData,
          phone: `92${smsData.phone}`,
        };
        const response = await forgotSmsRequest(payload);
        if (errorMessage.includes(response?.message)) {
          const message =
            response?.message ===
            'phone is not validated, please contact customer service'
              ? 'Phone number is not validated, please contact customer service'
              : `${response?.message}, this user might be not registered.`;
          throw new Error(message);
        }
        if (typeof response?.data === 'boolean' && response?.data === false) {
          throw new Error(response?.message);
        }
        if (response?.message?.split(' ')[0] === 'Resend') {
          throw new Error(response.data?.message);
        }
        return response;
      } else {
        const response = await forgotEmailRequest(data as IForgotEmail);

        if (errorMessage.includes(response?.message)) {
          throw new Error(response?.message);
        }
        if (typeof response?.data === 'boolean' && response?.data === false) {
          throw new Error(response?.message);
        }
        if (response?.message?.split(' ')[0] === 'Resend') {
          throw new Error(response.data?.message);
        }
        return response;
      }
    },
    onSuccess: (response: IBaseResponse<{ message: string }>) => {
      start();
      Toast.show({
        type: 'success',
        text1:
          response?.message.charAt(0).toUpperCase() +
          response?.message.slice(1),
        onShow: () => {
          setRequestSuccededAlready(true);
        },
      });
    },
    onError: (err: any) => {
      console.log('This is the error: ', err);
      Toast.show({
        type: 'error',
        text1: 'Request failed',
        text2: err?.message,
      });
    },
  });

  const { mutate: resetPassword } = useMutation({
    mutationFn: async (data: IResetPassword) => {
      Toast.show({
        type: 'promise',
        text1: 'Resetting password...',
      });
      if (selectedRecovery === 'sms') {
        const response = await resetPasswordSms(data as IResetPasswordSms);
        if (typeof response?.data === 'boolean' && response?.data === false) {
          throw new Error(response?.message);
        }

        return response;
      } else {
        const response = await resetPasswordEmail(data as IResetPasswordEmail);
        if (typeof response?.data === 'boolean' && response?.data === false) {
          throw new Error(response?.message);
        }
        return response;
      }
    },
    onSuccess: (response: IBaseResponse<{ message: string }>) => {
      Toast.show({
        type: 'success',
        text1:
          response?.message.charAt(0).toUpperCase() +
          response?.message.slice(1),
        onHide: () => {
          handleClose();
        },
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1:
          err?.message?.charAt(0).toUpperCase() + err?.message?.slice(1) ||
          'Reset failed',
      });
    },
  });

  const onResetPassword = (data: IResetPassword) => {
    const payload = {
      ...data,
      ...(selectedRecovery === 'sms'
        ? {
            mobile: `92${smsForm.getValues().phone}`,
            username: smsForm.getValues().username,
          }
        : emailForm.getValues()),
    };
    resetPassword(payload);
  };

  const onRequestCode = (data: IForgotSms | IForgotEmail) => {
    requestCode(data);
  };

  const smsForm = useForm<IForgotSms>({
    resolver: yupResolver(forgotSmsSchema),
    defaultValues: {
      username: '',
      phone: '',
    },
  });

  const emailForm = useForm<IForgotEmail>({
    resolver: yupResolver(forgotEmailSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  const resetPasswordForm = useForm<IResetPassword>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      password_confirmation: '',
      otp: '',
    },
  });

  return (
    <Modal
      visible={open}
      backdropStyle={styles.backdrop}
      animationType="fade"
      hardwareAccelerated={true}
      style={styles.modal}
    >
      <View
        style={[styles.container, { backgroundColor: theme['bg-secondary'] }]}
      >
        <TabView
          selectedIndex={selectedRecovery === 'sms' ? 0 : 1}
          onSelect={index => {
            const newRecovery = index === 0 ? 'sms' : 'email';
            if (!requestSuccededAlready) {
              if (newRecovery === 'sms') {
                smsForm.reset();
              } else {
                emailForm.reset();
              }
            }
            setSelectedRecovery(newRecovery);
          }}
        >
          <Tab
            title={t('forgot-password-screen.sms-recovery')}
            disabled={
              isPending ||
              (requestSuccededAlready && selectedRecovery === 'email')
            }
          >
            <View key="sms" style={styles.formContainer}>
              <Controller
                name="username"
                control={smsForm.control}
                render={({ field: { onChange, onBlur, value } }) => {
                  const usernameError = smsForm.formState.errors.username;
                  let errorMessage = '';
                  
                  if (usernameError?.message) {
                    // Translate Yup error messages
                    const yupMessage = usernameError.message;
                    if (yupMessage === 'Username is required') {
                      errorMessage = t('auth.username-is-required');
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
                        onChangeText={onChange}
                        onBlur={onBlur}
                        accessoryLeft={() => (
                          <View style={styles.countryCodeContainer}>
                            <Text style={styles.inputPrefixText}>ID</Text>
                          </View>
                        )}
                        status={
                          smsForm.formState.errors.username ? 'danger' : 'basic'
                        }
                      />
                      {errorMessage ? (
                        <View style={styles.errorContainer}>
                          <Text style={styles.errorText}>
                            {errorMessage}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  );
                }}
              />
              <Controller
                name="phone"
                control={smsForm.control}
                render={({ field: { onChange, onBlur, value } }) => {
                  const phoneErrors = smsForm.formState.errors.phone;
                  let errorMessage = '';
                  
                  if (phoneErrors) {
                    // Translate Yup error messages first
                    const yupMessage = phoneErrors.message || '';
                    
                    // Check if it's a required error
                    if (!value || yupMessage === 'Phone number is required' || yupMessage.includes('required')) {
                      errorMessage = t('auth.phone-number-is-required');
                    } else {
                      // Check if we have multiple error types
                      const errors: string[] = [];
                      
                      // Check for prefix error first
                      const hasPrefixError = value && (value.startsWith('0') || value.startsWith('92') || value.startsWith('+92'));
                      
                      if (hasPrefixError) {
                        // When prefix error occurs, show both errors
                        errors.push(t('auth.invalid-mobile-number-format'));
                        errors.push(t('auth.do-not-add-prefix'));
                      } else {
                        // Check for format error only if no prefix error
                        if (value && !/^\d{10}$/.test(value)) {
                          errors.push(t('auth.invalid-mobile-number-format'));
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
                        } else if (yupMessage === 'Do not add 0, +92, or 92 at the start of the number.') {
                          errorMessage = t('auth.do-not-add-prefix');
                        } else {
                          errorMessage = yupMessage;
                        }
                      }
                    }
                  }
                  
                  return (
                    <View>
                      <InputWithOtp
                        style={styles.input}
                        textStyle={styles.inputText}
                        placeholder={t('login-screen.placeholder.phone')}
                        value={value}
                        onChangeText={(text) => handlePhoneChange(text, onChange)}
                        onBlur={onBlur}
                        keyboardType="number-pad"
                        maxLength={10}
                        otpSettings={{
                          disabled: !smsForm.formState.isValid,
                          isLoading: isPending,
                          onClick: () => {
                            if (!isRunning) {
                              smsForm.handleSubmit(onRequestCode)();
                            }
                          },
                          isRunning,
                          secondsLeft,
                          label: t('forgot-password-screen.get-otp'),
                        }}
                        // eslint-disable-next-line react/no-unstable-nested-components
                        accessoryLeft={() => (
                          <View style={styles.countryCodeContainer}>
                            <Text style={styles.inputPrefixText}>+92</Text>
                          </View>
                        )}
                        status={smsForm.formState.errors.phone ? 'danger' : 'basic'}
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
              {requestSuccededAlready && (
                <ResetPasswordFields resetPasswordForm={resetPasswordForm} />
              )}
            </View>
          </Tab>
          <Tab
            title={t('forgot-password-screen.email-recovery')}
            disabled={
              isPending ||
              (requestSuccededAlready && selectedRecovery === 'sms')
            }
          >
            <View key="email" style={styles.formContainer}>
              <Controller
                name="username"
                control={emailForm.control}
                render={({ field: { onChange, onBlur, value } }) => {
                  const usernameError = emailForm.formState.errors.username;
                  let errorMessage = '';
                  
                  if (usernameError?.message) {
                    // Translate Yup error messages
                    const yupMessage = usernameError.message;
                    if (yupMessage === 'Username is required') {
                      errorMessage = t('auth.username-is-required');
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
                        onChangeText={onChange}
                        onBlur={onBlur}
                        accessoryLeft={() => (
                          <View style={styles.countryCodeContainer}>
                            <Text style={styles.inputPrefixText}>ID</Text>
                          </View>
                        )}
                        status={
                          emailForm.formState.errors.username ? 'danger' : 'basic'
                        }
                      />
                      {errorMessage ? (
                        <View style={styles.errorContainer}>
                          <Text style={styles.errorText}>
                            {errorMessage}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  );
                }}
              />
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field: { onChange, onBlur, value } }) => {
                  const emailError = emailForm.formState.errors.email;
                  let errorMessage = '';
                  
                  if (emailError?.message) {
                    // Translate Yup error messages
                    const yupMessage = emailError.message;
                    if (yupMessage === 'Email is required') {
                      errorMessage = t('auth.email-is-required') || yupMessage;
                    } else if (yupMessage === 'Must be a valid email address') {
                      errorMessage = t('auth.email-invalid') || yupMessage;
                    } else if (yupMessage === 'Email must include a proper domain') {
                      errorMessage = t('auth.email-domain-invalid') || yupMessage;
                    } else if (yupMessage === 'Email cannot contain spaces') {
                      errorMessage = t('auth.email-cannot-contain-spaces') || yupMessage;
                    } else {
                      errorMessage = yupMessage;
                    }
                  }
                  
                  return (
                    <View>
                      <InputWithOtp
                        style={styles.input}
                        textStyle={styles.inputText}
                        placeholder={t('forgot-password-screen.placeholder.email')}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        otpSettings={{
                          disabled: !emailForm.formState.isValid,
                          isLoading: isPending,
                          onClick: () => {
                            if (!isRunning) {
                              emailForm.handleSubmit(onRequestCode)();
                            }
                          },
                          isRunning,
                          secondsLeft,
                          label: t('forgot-password-screen.get-otp'),
                        }}
                        accessoryLeft={() => (
                          <MailIcon size={16} color="gray"  />
                        )}
                        status={
                          emailForm.formState.errors.email ? 'danger' : 'basic'
                        }
                      />
                      {errorMessage ? (
                        <View style={styles.errorContainer}>
                          <Text style={styles.errorText}>
                            {errorMessage}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  );
                }}
              />
              {requestSuccededAlready && (
                <ResetPasswordFields resetPasswordForm={resetPasswordForm} />
              )}
            </View>
          </Tab>
        </TabView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            appearance="outline"
            status="success"
            onPress={handleClose}
            style={styles.button}
          >
            {t('forgot-password-screen.cancel')}
          </Button>
          <Button
            style={styles.button}
            appearance="filled"
            status="success"
            disabled={!resetPasswordForm.formState.isValid}
            onPress={() => {
              resetPasswordForm.handleSubmit(onResetPassword)();
            }}
          >
            {t('forgot-password-screen.recover')}
          </Button>
        </View>
      </View>
      <Toast config={toastConfig} position="top" visibilityTime={3000} />
    </Modal>
  );
}

interface ResetPasswordFieldsProps {
  resetPasswordForm: ReturnType<typeof useForm<IResetPassword>>;
}

export const ResetPasswordFields = ({
  resetPasswordForm,
}: ResetPasswordFieldsProps) => {
  const { t } = useTranslation();
  
  return (
    <Fragment>
      <Controller
        name="otp"
        control={resetPasswordForm.control}
        render={({ field: { onChange, onBlur, value } }) => {
          const otpError = resetPasswordForm.formState.errors.otp;
          let errorMessage = '';
          
          if (otpError?.message) {
            const yupMessage = otpError.message;
            if (yupMessage === 'OTP is required') {
              errorMessage = t('auth.otp-is-required') || yupMessage;
            } else if (yupMessage === 'OTP cannot contain spaces') {
              errorMessage = t('auth.otp-cannot-contain-spaces') || yupMessage;
            } else {
              errorMessage = yupMessage;
            }
          }
          
          return (
            <View>
              <Input
                style={styles.input}
                textStyle={styles.inputText}
                placeholder={t('forgot-password-screen.placeholder.otp')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={6}
                status={resetPasswordForm.formState.errors.otp ? 'danger' : 'basic'}
              />
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
      <Controller
        name="newPassword"
        control={resetPasswordForm.control}
        render={({ field: { onChange, onBlur, value } }) => {
          const passwordError = resetPasswordForm.formState.errors.newPassword;
          let errorMessage = '';
          
          if (passwordError?.message) {
            const yupMessage = passwordError.message;
            if (yupMessage === 'New password is required') {
              errorMessage = t('auth.new-password-is-required') || yupMessage;
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
                placeholder={t('forgot-password-screen.placeholder.create-strong-password')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                status={
                  resetPasswordForm.formState.errors.newPassword
                    ? 'danger'
                    : 'basic'
                }
              />
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
      <Controller
        name="password_confirmation"
        control={resetPasswordForm.control}
        render={({ field: { onChange, onBlur, value } }) => {
          const confirmPasswordError = resetPasswordForm.formState.errors.password_confirmation;
          let errorMessage = '';
          
          if (confirmPasswordError?.message) {
            const yupMessage = confirmPasswordError.message;
            if (yupMessage === 'Confirm password is required1' || yupMessage === 'Confirm password is required') {
              errorMessage = t('auth.confirm-password-is-required') || yupMessage;
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
                placeholder={t('forgot-password-screen.placeholder.confirm-password')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                status={
                  resetPasswordForm.formState.errors.password_confirmation
                    ? 'danger'
                    : 'basic'
                }
              />
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
    zIndex: 1000,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    borderRadius: 10,
    margin: 0,
    padding: 20,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    paddingVertical: 10,
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
    paddingLeft: 10,
  },
});

export default ForgotPassDialog;
