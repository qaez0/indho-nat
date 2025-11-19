import * as yup from 'yup';

const FILE_SIZE = 1 * 1024 * 1024;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

export const onlinePaySchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .when('$minAmount', (minAmount: unknown, schema) =>
      schema.min(minAmount as number, `Amount must be at least ${minAmount}`),
    )
    .when('$maxAmount', (maxAmount: unknown, schema) =>
      schema.max(maxAmount as number, `Amount must be at most ${maxAmount}`),
    ),
});

export const bankSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .when('$minAmount', (minAmount: unknown, schema) =>
      schema.min(minAmount as number, `Amount must be at least ${minAmount}`),
    )
    .when('$maxAmount', (maxAmount: unknown, schema) =>
      schema.max(maxAmount as number, `Amount must be at most ${maxAmount}`),
    ),
  reference_number: yup.string().nullable().default(null),
  image: yup
    .mixed()
    .required('Proof of transaction is required')
    .test('fileSize', 'File size is too large (max 1MB)', (value: any) => {
      if (!value) return false;
      const file = value[0] || value;
      return file.size <= FILE_SIZE;
    })
    .test(
      'fileFormat',
      'Unsupported file format (only PNG or JPG)',
      (value: any) => {
        if (!value) return false;
        const file = value[0] || value;
        return SUPPORTED_FORMATS.includes(file.type);
      },
    ),
});

export const cryptoSchema = yup.object().shape({
  amount_in_rupees: yup
    .number()
    .nullable()
    .typeError('Amount must be a number')
    .default(null),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .when('$minAmount', (minAmount: unknown, schema) =>
      schema.min(minAmount as number, `Amount must be at least ${minAmount}`),
    )
    .when('$maxAmount', (maxAmount: unknown, schema) =>
      schema.max(maxAmount as number, `Amount must be at most ${maxAmount}`),
    ),
});
