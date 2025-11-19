import * as yup from 'yup';

export const phoneLoginSchema = yup.object().shape({
  phone: yup
    .string()
    .required('Phone number is required')
    .max(10, 'Mobile number must be 10 digits')
    .matches(/^\d{10}$/, 'Invalid Mobile Number Format')
    .test(
      'no-prefix',
      'Do not add 0, +92, or 92 at the start of the number.',
      function (value) {
        if (!value) return true; // Let required() handle empty values
        // Check if the number starts with 0, +92, or 92
        if (value.startsWith('0') || value.startsWith('92') || value.startsWith('+92')) {
          return false;
        }
        return true;
      },
    ),
  password: yup.string().required('Password is required').matches(/^\S*$/, 'Password cannot contain spaces'),
});

export const usernameLoginSchema = yup.object().shape({
  player_id: yup
    .string()
    .required('Username is required')
    .min(4, 'Username too short')
    .matches(/^\S*$/, 'Username cannot contain spaces'),
  password: yup.string()
    .required('Password is required')
    .matches(/^\S*$/, 'Password cannot contain spaces'),
  
});

export const forgotSmsSchema = yup.object().shape({
  username: yup.string().required('Username is required').matches(/^\S*$/, 'Username cannot contain spaces'),
  phone: yup
    .string()
    .required('Phone number is required')
    .max(10, 'Mobile number must be 10 digits')
    .matches(/^\d{10}$/, 'Invalid Mobile Number Format')
    .test(
      'no-prefix',
      'Do not add 0, +92, or 92 at the start of the number.',
      function (value) {
        if (!value) return true; // Let required() handle empty values
        // Check if the number starts with 0, +92, or 92
        if (value.startsWith('0') || value.startsWith('92') || value.startsWith('+92')) {
          return false;
        }
        return true;
      },
    ),
});

export const forgotEmailSchema = yup.object().shape({
  username: yup.string().required('Username is required').matches(/^\S*$/, 'Username cannot contain spaces'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Email must include a proper domain',
    )
    .matches(/^\S*$/, 'Email cannot contain spaces'),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup.string().required('New password is required').matches(/^\S*$/, 'Password cannot contain spaces'),
  password_confirmation: yup.string().required('Confirm password is required1').matches(/^\S*$/, 'Password cannot contain spaces'),
  otp: yup.string().required('OTP is required').matches(/^\S*$/, 'OTP cannot contain spaces'),
});

export const registerSchema = yup.object().shape({
  phone: yup
    .string()
    .required('Phone number is required')
    .max(10, 'Mobile number must be 10 digits')
    .matches(/^\d{10}$/, 'Invalid Mobile Number Format')
    .test(
      'no-prefix',
      'Do not add 0, +92, or 92 at the start of the number.',
      function (value) {
        if (!value) return true; // Let required() handle empty values
        // Check if the number starts with 0, +92, or 92
        if (value.startsWith('0') || value.startsWith('92') || value.startsWith('+92')) {
          return false;
        }
        return true;
      },
    ),
  password: yup.string().required('Password is required').matches(/^\S*$/, 'Password cannot contain spaces'),
  invitation_code: yup.string().optional().default('').matches(/^\S*$/, 'Password cannot contain spaces'),
  agreement: yup
    .boolean()
    .required('You must agree to the terms and conditions')
    .default(false)
    .oneOf([true], 'You must accept the terms and conditions'),
});
