import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Button as KittenButton,
  Text as KittenText,
  Input as KittenInput,
  Select as KittenSelect,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { IFormConfig } from '../types/ui';
import OTPInput from './OTPInput';

interface IFormHelperProps extends IFormConfig {
  onClose: () => void;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  countdownState?: {
    secondsLeft: number;
    isRunning: boolean;
    start: () => void;
  };
}

const FormHelper = ({
  fields,
  title,
  buttonText,
  onClose,
  form,
  onSubmit,
  countdownState,
}: IFormHelperProps) => {
  // Only render the submit button if fields are loaded
  const hasFields = fields && fields.length > 0;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxHeight: '80%',
      }}
    >
      <View style={styles.headerContainer}>
        <KittenText category="s1" style={styles.titleText}>
          {title}
        </KittenText>
        <TouchableOpacity onPress={onClose} style={styles.closeButtonTouchable}>
          <Feather name="x" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.fieldsContainer}>
        {fields.map((field: any) => (
          <Controller
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: controllerField, fieldState }) => {
              const { menuItems, ...fieldProps } = field;

              if (menuItems && menuItems.length > 0) {
                const idx = menuItems.findIndex(
                  (item: string) => item === controllerField.value,
                );
                const selectedIndex = idx >= 0 ? new IndexPath(idx) : undefined;

                return (
                  <KittenSelect
                    {...controllerField}
                    {...fieldProps}
                    selectedIndex={selectedIndex as IndexPath | undefined}
                    onSelect={index => {
                      const rowIndex =
                        Array.isArray(index) ||
                        (index as any)?.row === undefined
                          ? (index as unknown as number)
                          : (index as IndexPath).row;
                      const value = menuItems[rowIndex];
                      controllerField.onChange(value);
                    }}
                    status={fieldState.error ? 'danger' : 'basic'}
                    caption={fieldState.error?.message}
                  >
                    {menuItems.map((item: string) => (
                      <SelectItem key={item} title={item} />
                    ))}
                  </KittenSelect>
                );
              } else if (field.name === 'otp') {
                return <OTPInput form={form} name={field.name} />;
              } else {
                return (
                  <InputWithAccessories
                    controllerField={controllerField}
                    fieldState={fieldState}
                    fieldProps={fieldProps}
                    countdownState={countdownState}
                  />
                );
              }
            }}
          />
        ))}
      </View>
      {hasFields && (
        <KittenButton
          appearance="filled"
          status="success"
          style={styles.submitButton}
          onPress={() => {
            form.handleSubmit(onSubmit)();
          }}
        >
          {buttonText}
        </KittenButton>
      )}
    </View>
  );
};

export default FormHelper;

const InputWithAccessories = ({
  controllerField,
  fieldState,
  fieldProps,
  countdownState,
}: {
  controllerField: any;
  fieldState: any;
  fieldProps: any;
  countdownState?: {
    secondsLeft: number;
    isRunning: boolean;
    start: () => void;
  };
}) => {
  const [secureEntry, setSecureEntry] = useState(
    fieldProps.secureTextEntry ?? false,
  );
  const renderAccessoryRight = () => {
    if (fieldProps.otpSettings) {
      // Use live countdown state if available, otherwise fall back to static otpSettings
      const currentSecondsLeft =
        countdownState?.secondsLeft ?? fieldProps.otpSettings?.secondsLeft;
      const currentIsRunning =
        countdownState?.isRunning ?? fieldProps.otpSettings?.isRunning;

      return (
        <KittenButton
          appearance="ghost"
          status="success"
          onPress={() => {
            fieldProps.otpSettings?.onClick?.();
          }}
          disabled={fieldProps.otpSettings?.disabled || currentIsRunning}
        >
          {fieldProps.otpSettings?.isLoading
            ? ''
            : currentIsRunning
            ? `${currentSecondsLeft} sec`
            : fieldProps.otpSettings?.label || 'Get OTP'}
        </KittenButton>
      );
    }
    if (fieldProps.secureTextEntry) {
      return (
        <TouchableOpacity
          onPress={() => setSecureEntry(!secureEntry)}
          style={styles.rightAccessoryTouchable}
        >
          <Feather
            name={secureEntry ? 'eye-off' : 'eye'}
            size={18}
            color="white"
          />
        </TouchableOpacity>
      );
    }
    if (controllerField.value && !fieldProps.readOnly) {
      return (
        <TouchableOpacity
          onPress={() => controllerField.onChange('')}
          style={styles.rightAccessoryTouchable}
        >
          <Feather name="x-circle" size={18} color="white" />
        </TouchableOpacity>
      );
    }
    return <></>;
  };

  return (
    <KittenInput
      {...fieldProps}
      {...controllerField}
      value={
        fieldProps.readOnly && fieldProps.value
          ? fieldProps.value
          : controllerField.value != null
          ? String(controllerField.value)
          : ''
      }
      onChangeText={text => controllerField.onChange(text)}
      status={fieldState.error ? 'danger' : 'basic'}
      caption={fieldState.error?.message}
      labelColor="#FFFFFF"
      accessoryRight={renderAccessoryRight}
      {...(fieldProps.secureTextEntry && { secureTextEntry: secureEntry })}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  titleText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButtonTouchable: {
    position: 'absolute',
    right: 0,
    top: -5,
    padding: 4,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  fieldsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  rightAccessoryTouchable: {
    paddingRight: 10,
  },
  divider: {
    width: 2,
    height: 25,
    backgroundColor: '#FFAA06',
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 10,
  },
  submitButton: {
    minHeight: 40,
  },
});
