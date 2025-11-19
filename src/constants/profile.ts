import type { IModalItems, IOtpSettings } from '../types/ui';

export const profileModalFields = (
  identifier: string,
  str?: string,
  otpSettings?: IOtpSettings,
  t?: (key: string) => string,
) => {
  const fields: IModalItems = {
    'change-pass': {
      title: t?.('profile.change-pass-dialog.title') || 'Change Password',
      buttonText: t?.('profile.change-pass-dialog.submit-btn') || 'Save',
      form_id: 'change-pass',
      fields: [
        {
          placeholder: t?.('profile.change-pass-dialog.old-pass-placeholder') || 'Enter password',
          label: t?.('profile.change-pass-dialog.old-pass') || 'Old Password',
          name: 'old_password',
          secureTextEntry: true,
        },
        {
          placeholder: t?.('profile.enter-new-pass-placeholder') || 'Enter new password',
          label: t?.('profile.enter-new-pass') || 'Enter new password',
          name: 'new_password',
          secureTextEntry: true,
        },
        {
          placeholder: t?.('profile.confirm-pass-placeholder') || 'Re-enter password',
          label: t?.('profile.confirm-pass') || 'Confirm Password',
          name: 'confirm_password',
          secureTextEntry: true,
        },
      ],
    },
    'set-wallet-pass': {
      title: t?.('profile.set-wallet-pass-dialog.title') || 'Set Wallet Password',
      buttonText: t?.('profile.set-wallet-pass-dialog.submit-btn') || 'Save',
      form_id: 'set-wallet-pass',
      fields: [
        {
          placeholder: t?.('profile.enter-new-pass-placeholder') || 'Enter new password',
          label: t?.('profile.enter-new-pass') || 'Enter new password',
          name: 'password',
          secureTextEntry: true,
        },
        {
          placeholder: t?.('profile.confirm-pass-placeholder') || 'Re-enter password',
          label: t?.('profile.confirm-pass') || 'Confirm Password',
          name: 'confirm_password',
          secureTextEntry: true,
        },
      ],
    },
    'verify-mobile': {
      title: t?.('profile.verify-mobile.title') || 'Verify Mobile Number',
      buttonText: t?.('profile.verify-mobile.submit-btn') || 'Verify',
      form_id: 'verify-mobile',
      fields: [
        {
          label: t?.('profile.mobile-number') || 'Mobile Number',
          name: 'phone',
          value: str,
          readOnly: true,
          otpSettings,
        },
        {
          label: t?.('profile.verification-code') || 'Verification Code',
          name: 'otp',
        },
      ],
    },
    'verify-email': {
      title: t?.('profile.verify-email.title') || 'Verify Email Address',
      buttonText: t?.('profile.verify-email.submit-btn') || 'Verify',
      form_id: 'verify-email',
      fields: [
        {
          label: t?.('profile.email') || 'Email Address',
          name: 'email',
          value: str,
          disabled: true,
          otpSettings,
        },
        {
          label: t?.('profile.verification-code') || 'Verification Code',
          name: 'otp',
        },
      ],
    },
  };

  return fields[identifier];
};
