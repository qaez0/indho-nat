import { Fragment } from 'react';
import { Content, CustomInput } from '../../component';
import type {
  VerfiyPhoneNumber,
  VerifyPhoneNumberType,
} from '../../../../types/player';
import type { UseFormReturn } from 'react-hook-form';
import OTPInput from '../../../../components/OTPInput';
import { IOtpSettings } from '../../../../types/ui';

const PhoneVerify = ({
  otpForm,
  phoneForm,
  phone,
  otpSettings,
}: {
  otpForm: UseFormReturn<VerfiyPhoneNumber>;
  phoneForm: UseFormReturn<VerifyPhoneNumberType>;
  phone: string;
  otpSettings: IOtpSettings;
}) => {
  const removeCountryCode = phone.startsWith('91') ? phone.slice(2) : phone;
  return (
    <Content
      label="To continue, please add and verify your mobile number"
      labelStyle={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 12,
        fontWeight: '400',
      }}
      content={
        <Fragment>
          <CustomInput
            value={removeCountryCode}
            name="phone"
            readOnly={phone !== ''}
            form={phoneForm}
            currency="+91"
            maxLength={phone === '' ? 10 : undefined}
            keyboardType="numeric"
            otpSettings={otpSettings}
          />
          <OTPInput form={otpForm} name="otp" />
        </Fragment>
      }
    />
  );
};

export default PhoneVerify;
