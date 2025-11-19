import { TFunction } from 'i18next';

/**
 * Translates common Yup validation error messages
 * @param errorMessage - The error message from Yup
 * @param t - Translation function from useTranslation hook
 * @returns Translated error message or original if no translation found
 */
export const translateYupError = (errorMessage: string, t: TFunction): string => {
  if (!errorMessage) return errorMessage;

  // Deposit/Withdrawal Amount errors
  if (errorMessage === 'Amount must be a number') {
    return t('validation.errors.amount-must-be-number');
  }
  if (errorMessage === 'Amount is required') {
    return t('validation.errors.amount-required');
  }
  const minMatch = errorMessage.match(/Amount must be at least (\d+)/);
  if (minMatch) {
    return t('validation.errors.amount-min', { min: minMatch[1] });
  }
  const maxMatch = errorMessage.match(/Amount must be at most (\d+)/);
  if (maxMatch) {
    return t('validation.errors.amount-max', { max: maxMatch[1] });
  }

  // Balance and Turnover errors
  if (errorMessage === 'Insufficient balance') {
    return t('validation.errors.insufficient-balance');
  }
  if (errorMessage === 'Turnover not yet completed') {
    return t('validation.errors.turnover-not-completed');
  }

  // Password errors
  if (errorMessage === 'Password is required') {
    return t('validation.errors.password-required');
  }
  if (errorMessage === 'Password cannot contain spaces') {
    return t('validation.errors.password-no-spaces');
  }
  if (errorMessage === 'Old password is required') {
    return t('validation.errors.old-password-required');
  }
  if (errorMessage === 'New password is required') {
    return t('validation.errors.new-password-required');
  }
  if (errorMessage === 'Confirm password is required') {
    return t('validation.errors.confirm-password-required');
  }
  if (errorMessage === 'Withdraw password is required') {
    return t('validation.errors.withdraw-password-required');
  }
  if (errorMessage === 'Must contain both letters and numbers') {
    return t('validation.errors.password-letters-numbers');
  }
  if (errorMessage === 'Up to 8 characters') {
    return t('validation.errors.password-8-characters');
  }

  // Phone number errors
  if (errorMessage === 'Phone number is required') {
    return t('validation.errors.phone-required');
  }
  if (errorMessage === 'Mobile number must be 10 digits') {
    return t('validation.errors.phone-10-digits');
  }
  if (errorMessage === 'Invalid Mobile Number Format') {
    return t('validation.errors.phone-invalid-format');
  }

  // Email errors
  if (errorMessage === 'Email address is required') {
    return t('validation.errors.email-required');
  }
  if (errorMessage === 'Email is required') {
    return t('validation.errors.email-required');
  }
  if (errorMessage === 'Invalid email address') {
    return t('validation.errors.email-invalid');
  }
  if (errorMessage === 'Email cannot contain spaces' || errorMessage === 'Email add Press cannot contain spaces') {
    return t('validation.errors.email-no-spaces');
  }

  // Username errors
  if (errorMessage === 'Username is required') {
    return t('validation.errors.username-required');
  }
  if (errorMessage === 'Username cannot contain spaces') {
    return t('validation.errors.username-no-spaces');
  }
  if (errorMessage === 'Username too short') {
    return t('validation.errors.username-too-short');
  }

  // OTP errors
  if (errorMessage === 'OTP is required') {
    return t('validation.errors.otp-required');
  }
  if (errorMessage === 'OTP must be 6 digits') {
    return t('validation.errors.otp-6-digits');
  }
  if (errorMessage === 'OTP cannot contain spaces') {
    return t('validation.errors.otp-no-spaces');
  }

  // Profile errors
  if (errorMessage === 'Real name is required') {
    return t('validation.errors.real-name-required');
  }
  if (errorMessage === 'Gender is required') {
    return t('validation.errors.gender-required');
  }
  if (errorMessage === 'Birthday is required') {
    return t('validation.errors.birthday-required');
  }

  // Wallet/Bank errors
  if (errorMessage === 'E-Wallet Name is required') {
    return t('validation.errors.e-wallet-name-required');
  }
  if (errorMessage === 'E-Wallet Account Number is required') {
    return t('validation.errors.e-wallet-account-required');
  }
  if (errorMessage === 'E-Wallet Account Number cannot contain spaces') {
    return t('validation.errors.e-wallet-account-no-spaces');
  }
  if (errorMessage === 'Bank Name is required') {
    return t('validation.errors.bank-name-required');
  }
  if (errorMessage === 'Bank Account Number is required') {
    return t('validation.errors.bank-account-required');
  }
  if (errorMessage === 'Bank Account Number cannot contain spaces') {
    return t('validation.errors.bank-account-no-spaces');
  }
  if (errorMessage === 'Must be only digits') {
    return t('validation.errors.only-digits');
  }
  if (errorMessage.match(/Account number must be at least (\d+) digits/)) {
    const match = errorMessage.match(/Account number must be at least (\d+) digits/);
    return t('validation.errors.account-min-digits', { min: match?.[1] || '' });
  }
  if (errorMessage.match(/Account number must be at most (\d+) digits/)) {
    const match = errorMessage.match(/Account number must be at most (\d+) digits/);
    return t('validation.errors.account-max-digits', { max: match?.[1] || '' });
  }
  if (errorMessage.match(/Account number must be exactly (\d+) digits/)) {
    const match = errorMessage.match(/Account number must be exactly (\d+) digits/);
    return t('validation.errors.account-exact-digits', { digits: match?.[1] || '' });
  }
  if (errorMessage === 'Wallet Name is required') {
    return t('validation.errors.wallet-name-required');
  }
  if (errorMessage === 'USDT Address is required') {
    return t('validation.errors.usdt-address-required');
  }
  if (errorMessage === 'No special characters allowed') {
    return t('validation.errors.no-special-characters');
  }
  if (errorMessage.match(/Wallet Address must be exactly (\d+) characters/)) {
    const match = errorMessage.match(/Wallet Address must be exactly (\d+) characters/);
    return t('validation.errors.wallet-address-exact-length', { length: match?.[1] || '' });
  }
  if (errorMessage === "Wallet Address must start with 'T'") {
    return t('validation.errors.wallet-address-start-t');
  }
  if (errorMessage === 'Wallet Address cannot contain spaces') {
    return t('validation.errors.wallet-address-no-spaces');
  }

  // File upload errors
  if (errorMessage === 'Proof of transaction is required') {
    return t('validation.errors.proof-required');
  }
  if (errorMessage === 'File size is too large (max 1MB)') {
    return t('validation.errors.file-too-large');
  }
  if (errorMessage === 'Unsupported file format (only PNG or JPG)') {
    return t('validation.errors.file-format-unsupported');
  }
  if (errorMessage === 'KYC image is required') {
    return t('validation.errors.kyc-image-required');
  }
  if (errorMessage === 'File size should not exceed 5MB') {
    return t('validation.errors.file-too-large-5mb');
  }
  if (errorMessage === 'Only JPG, JPEG and PNG files are allowed') {
    return t('validation.errors.file-format-jpg-png');
  }

  // Agreement errors
  if (errorMessage === 'You must agree to the terms and conditions') {
    return t('validation.errors.agreement-required');
  }

  // Return original message if no translation found
  return errorMessage;
};

