import * as yup from 'yup';

export const updateRealNameSchema = yup.object().shape({
  real_name: yup.string().required('Real name is required'),
});

export const createWithdrawalPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .max(8, 'Up to 8 characters')
    .min(8, 'Up to 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,8}$/,
      'Must contain both letters and numbers',
    )
    .required('Password is required'),
});

export const verfiyPhoneNumberSchema = yup.object().shape({
  otp: yup.string().required('OTP is required').min(6, 'OTP must be 6 digits'),
});

export const changePasswordSchema = yup.object().shape({
  old_password: yup
    .string()
    .required('Old password is required')
    .matches(/^\S*$/, 'Password cannot contain spaces'),
  new_password: yup
    .string()
    .required('New password is required')
    .matches(/^\S*$/, 'Password cannot contain spaces'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .matches(/^\S*$/, 'Password cannot contain spaces'),
});

export const setWalletPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .matches(/^\S*$/, 'Password cannot contain spaces'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .matches(/^\S*$/, 'Password cannot contain spaces'),
});

export const verifyPhoneNumberSchema = yup.object().shape({
  phone: yup.string().required('Phone number is required'),
});

export const addPhoneNumberSchema = yup.object().shape({
  phone: yup
    .string()
    .required('Phone number is required')
    .max(10, 'Mobile number must be 10 digits')
    .matches(/^\d{10}$/, 'Invalid Mobile Number Format'),
});

export const verifyEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email address is required')
    .matches(/^\S*$/, 'Email add Press cannot contain spaces'),
});

export const updateProfileSchema = yup.object().shape({
  real_name: yup.string().required('Real name is required'),
  gender: yup.string().required('Gender is required'),
  birthday: yup.string().required('Birthday is required'),
});
