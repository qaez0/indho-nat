import { Content, CustomInput } from '../../component';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateWithdrawalPasswordType } from '../../../../types/player';

const WithdrawalPass = ({
  form,
}: {
  form: UseFormReturn<CreateWithdrawalPasswordType>;
}) => (
  <Content
    label="Create Withdrawal Password"
    content={
      <CustomInput
        placeholder="Create a password using letters & numbers"
        name="password"
        form={form}
        secureTextEntry={true}
        maxLength={8}
      />
    }
  />
);

export default WithdrawalPass;
