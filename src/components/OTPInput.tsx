import { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { type UseFormReturn } from 'react-hook-form';

const OTPInput = ({
  form,
  name,
}: {
  form: UseFormReturn<any>;
  name: string;
}) => {
  const [otpValue, setOtpValue] = useState<string>('');
  const hiddenInputRef = useRef<TextInput>(null);

  const focusInput = useCallback(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTextChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtpValue(numericValue);
    form.setValue(name, numericValue, { shouldValidate: true });
  };

  const handleContainerPress = () => {
    focusInput();
  };

  const getDisplayValue = (index: number) => {
    return otpValue[index] || '';
  };
  return (
    <TouchableOpacity
      style={styles.containerRow}
      onPress={handleContainerPress}
      activeOpacity={1}
    >
      <TextInput
        ref={hiddenInputRef}
        style={styles.hiddenInput}
        value={otpValue}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={6}
        returnKeyType="done"
        autoFocus={true}
        showSoftInputOnFocus={true}
      />

      {/* Visible display inputs */}
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <View key={index} style={styles.otpItem}>
            <View
              style={[
                styles.input,
                getDisplayValue(index) ? styles.inputFilled : styles.inputEmpty,
              ]}
            >
              <TextInput
                style={styles.displayText}
                value={getDisplayValue(index)}
                editable={false}
                pointerEvents="none"
              />
            </View>
          </View>
        ))}
    </TouchableOpacity>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    width: '100%',
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0,
    height: 50,
    width: '100%',
    zIndex: 1,
  },
  otpItem: {
    flex: 1,
  },
  input: {
    width: '100%',
    height: 50,
    minHeight: 50,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 8,
  },
  inputEmpty: {
    borderBottomColor: '#FFAA06',
  },
  inputFilled: {
    borderBottomColor: '#FFAA06',
  },
  displayText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
});
