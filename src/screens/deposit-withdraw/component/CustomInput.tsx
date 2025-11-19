import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  TextInputProps,
} from 'react-native';

import { IOtpSettings } from '../../../types/ui';
import Feather from '@react-native-vector-icons/feather';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateYupError } from '../../../utils/yupErrorTranslator';

export interface ICustomInputProps extends TextInputProps {
  otpSettings?: IOtpSettings;
  currency?: string;
  countryCode?: string;
  form?: any;
  name: string;
}

const CustomInput = ({
  otpSettings,
  currency,
  countryCode,
  form,
  ...props
}: ICustomInputProps) => {
  const { t } = useTranslation();
  const [secureEntry, setSecureEntry] = useState(
    props.secureTextEntry ?? false,
  );

  const renderAccessoryLeft = () => {
    if (currency) {
      return (
        <View style={styles.currency}>
          <Text style={styles.currencyText}>{currency}</Text>
          <View style={styles.divider} />
        </View>
      );
    }
    if (countryCode) {
      return <Text style={styles.countryCodeText}>{countryCode}</Text>;
    }
    return null;
  };

  const renderAccessoryRight = (field: any) => {
    if (otpSettings) {
      if (otpSettings.isRunning) {
        return (
          <TouchableOpacity style={styles.otpContainer}>
            <Text style={styles.otpText}>{otpSettings.secondsLeft} sec</Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          style={styles.otpButton}
          onPress={otpSettings.onClick}
          disabled={otpSettings.disabled || otpSettings.isLoading}
        >
          <Text style={styles.otpButtonText}>{otpSettings.label}</Text>
        </TouchableOpacity>
      );
    }
    if (props.secureTextEntry) {
      return (
        <TouchableOpacity
          onPress={() => setSecureEntry(!secureEntry)}
          style={styles.iconButton}
        >
          <Feather
            name={secureEntry ? 'eye-off' : 'eye'}
            size={18}
            color="white"
          />
        </TouchableOpacity>
      );
    }
    if (field.value && !props.readOnly) {
      return (
        <TouchableOpacity
          onPress={() => field.onChange('')}
          style={styles.iconButton}
        >
          <Feather name="x-circle" size={18} color="white" />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <Controller
      control={form?.control}
      name={props.name}
      render={({ field }) => {
        const inputValue =
          props.readOnly && props.value
            ? props.value
            : field.value != null
            ? String(field.value)
            : '';

        return (
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              {renderAccessoryLeft()}
              <TextInput
                {...props}
                value={inputValue}
                onChangeText={props.onChangeText || field.onChange}
                onBlur={field.onBlur}
                style={[
                  styles.input,
                  props.style,
                  currency && styles.inputWithCurrency,
                  countryCode && styles.inputWithCountryCode,
                ]}
                secureTextEntry={props.secureTextEntry ? secureEntry : false}
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderTextColor || '#999'}
                editable={!props.readOnly}
                keyboardType={props.keyboardType}
                autoCapitalize={props.autoCapitalize}
                autoCorrect={props.autoCorrect}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
              />
              {renderAccessoryRight(field)}
            </View>
            {form?.formState?.errors?.[props.name]?.message && (
              <Text style={styles.errorText}>
                {translateYupError(form.formState.errors[props.name]?.message || '', t)}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderBottomWidth: 1,
    borderBottomColor: '#FFAA06',
    minHeight: 40,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  inputWithCurrency: {
    paddingLeft: 0,
  },
  inputWithCountryCode: {
    paddingLeft: 0,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 5,
  },
  currencyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  countryCodeText: {
    color: 'white',
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 5,
  },
  divider: {
    width: 2,
    height: 25,
    backgroundColor: '#FFAA06',
    marginLeft: 5,
  },
  iconButton: {
    paddingRight: 10,
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpContainer: {
    paddingRight: 10,
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpText: {
    color: '#FFFFFF90',
    fontSize: 14,
    fontWeight: '500',
  },
  otpButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  otpButtonText: {
    color: '#FFFFFF90',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
});
