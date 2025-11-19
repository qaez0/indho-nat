import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getTermsData } from '../../../constants/terms';
import Accordion from './Accordion';

const Terms: React.FC = () => {
  const { t } = useTranslation();
  const termsData = getTermsData(t);
  
  return (
    <View style={styles.container}>
      {/* Introduction */}
      <View style={styles.introContainer}>
        <View style={styles.introContent}>
          <RNText style={styles.introText}>
            {t('information.terms.intro.paragraph-1')}
          </RNText>
          <RNText style={styles.introText}>
            {t('information.terms.intro.paragraph-2')}
          </RNText>
        </View>
      </View>

      <Accordion data={termsData || []} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  introContainer: {
    backgroundColor: '#232323',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  introContent: {
    gap: 16,
  },
  introText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
});

export default Terms;
