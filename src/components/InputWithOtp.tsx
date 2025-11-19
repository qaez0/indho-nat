import { Input, Button, Spinner, InputProps } from '@ui-kitten/components';
import type { IOtpSettings } from '../types/ui';

export interface InputWithOtpProps extends InputProps {
  otpSettings?: IOtpSettings;
}

const InputWithOtp = ({ otpSettings, ...props }: InputWithOtpProps) => {
  const AccessoryButton = (
    <Button
      appearance={!otpSettings?.isRunning ? 'filled' : 'outline'}
      style={{ borderRadius: 20, paddingHorizontal: 10 }}
      status="success"
      size="small"
      disabled={otpSettings?.disabled || otpSettings?.isRunning}
      onPress={() => {
        if (!otpSettings?.isRunning) {
          otpSettings?.onClick?.();
        }
      }}
      accessoryLeft={() =>
        otpSettings?.isLoading ? <Spinner size="small" /> : <></>
      }
    >
      {otpSettings?.isLoading
        ? ''
        : otpSettings?.isRunning
        ? `${otpSettings?.secondsLeft} sec`
        : otpSettings?.label || 'Get OTP'}
    </Button>
  );

  return <Input {...props} accessoryRight={() => AccessoryButton} />;
};

export default InputWithOtp;
