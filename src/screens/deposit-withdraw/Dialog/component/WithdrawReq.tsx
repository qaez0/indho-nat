import { Content, CustomInput } from "../../component";
import type { WithdrawType } from "../../../../types/withdraw";
import type { UseFormReturn } from "react-hook-form";

const WithdrawReq = ({ form }: { form: UseFormReturn<WithdrawType> }) => (
  <Content
    label="Enter Withdrawal Password"
    content={
      <CustomInput
        name="withdraw_password"
        form={form}
        secureTextEntry
        placeholder="Enter your withdrawal password"
      />
    }
  />
);

export default WithdrawReq;
