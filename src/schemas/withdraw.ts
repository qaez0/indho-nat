import * as yup from 'yup';

// Store balance in a module-level variable that can be updated
let currentBalanceTotal = 0;
let currentTurnoverAmount = 0;

export const setCurrentBalance = (balance: number) => {
  currentBalanceTotal = balance;
};

export const setCurrentTurnover = (turnover: number) => {
  currentTurnoverAmount = turnover;
};

export const withdrawSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .when('$minAmount', (minAmount: unknown, schema) =>
      schema.min(minAmount as number, `Amount must be at least ${minAmount}`),
    )
    .when('$maxAmount', (maxAmount: unknown, schema) =>
      schema.max(maxAmount as number, `Amount must be at most ${maxAmount}`),
    )
    .test(
      'insufficient-balance',
      'Insufficient balance',
      function (value) {
        if (value === undefined || value === null) return true; // Let required() handle this
        return value <= currentBalanceTotal;
      },
    )
    .test(
      'turnover-not-completed',
      'Turnover not yet completed',
      function (value) {
        if (value === undefined || value === null) return true; // Let required() handle this
        return currentTurnoverAmount <= 0;
      },
    ),
  withdraw_password: yup.string().required('Withdraw password is required'),
});
