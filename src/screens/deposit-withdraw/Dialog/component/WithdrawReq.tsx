import { Content, CustomInput } from "../../component";
import type { WithdrawType } from "../../../../types/withdraw";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

const WithdrawReq = ({ form }: { form: UseFormReturn<WithdrawType> }) => {
  const { t } = useTranslation();
  return (
    <Content
      label={t("deposit-withdraw.withdrawal-password.label")}
      content={
        <CustomInput
          name="withdraw_password"
          form={form}
          maxLength={8}
          secureTextEntry
          placeholder={t("deposit-withdraw.withdrawal-password.placeholder")}
        />
      }
    />
  );
};

export default WithdrawReq;
