import { Content, CustomInput } from '../../component';
import { UseFormReturn } from 'react-hook-form';
import { UpdateRealNameType } from '../../../../types/player';
import { useRef, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useUser } from '../../../../hooks/useUser';
import { useTranslation } from 'react-i18next';

interface IAskRealNameProps {
  form: UseFormReturn<UpdateRealNameType>;
}

const AskRealName = ({ form }: IAskRealNameProps) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const isProcessingRef = useRef(false);
  const existingRealName = user?.player_info?.real_name || '';
  const hasRealName = existingRealName.trim() !== '';

  // Initialize form with existing real name if it exists
  useEffect(() => {
    if (hasRealName && !form.getValues('real_name')) {
      form.setValue('real_name', existingRealName);
    }
  }, [hasRealName, existingRealName, form]);

  const handleTextChange = (text: string) => {
    // Prevent processing if already processing to avoid loops
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    // Remove any invalid characters (only allow letters and spaces)
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    
    // Ensure only single spaces (replace multiple spaces with single space)
    const singleSpaceText = filteredText.replace(/\s+/g, ' ');
    
    // Prevent leading spaces - if user tries to start with space, remove it
    const noLeadingSpace = singleSpaceText.startsWith(' ') ? singleSpaceText.trim() : singleSpaceText;
    
    // Update the form value
    form.setValue('real_name', noLeadingSpace);
    
    // Reset processing flag
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 50);
  };

  const handleBlur = () => {
    const currentValue = form.getValues('real_name');
    if (currentValue) {
      // Trim leading and trailing whitespace only on blur
      const trimmedValue = currentValue.trim();
      if (trimmedValue !== currentValue) {
        form.setValue('real_name', trimmedValue);
      }
    }
    // Dismiss keyboard to prevent position issues
    Keyboard.dismiss();
  };

  return (
    <Content
      label={t('kyc.full-name')}
      content={
        <CustomInput
          name="real_name"
          value={form.getValues('real_name')}
          form={form}
          placeholder={t('kyc.enter-your-real-name')}
          onBlur={handleBlur}
          onChangeText={handleTextChange}
          readOnly={hasRealName}
        />
      }
    />
  );
};

export default AskRealName;
