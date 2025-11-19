import { View, StyleSheet } from 'react-native';
import { Text as UIText } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
// import { useTranslation } from "react-i18next";

interface ITutorialProps {
  tutorial: string[];
  forWithdraw?: boolean;
}

const Tutorial = ({ tutorial, forWithdraw }: ITutorialProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.tutorialContainer}>
        {tutorial.map((item, index) => (
          <UIText key={index} style={styles.baseText}>
            {index + 1}. {item}
          </UIText>
        ))}
        {!forWithdraw && (
          <UIText style={[styles.baseText, styles.dontText]}>
            {t('deposit-withdraw.tutorial.dont-save-or-reuse-payment-info')}
          </UIText>
        )}
      </View>
    </View>
  );
};

export default Tutorial;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  tutorialContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  baseText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  dontText: {
    textAlign: 'center',
    color: 'red',
  },
});
